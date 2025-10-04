"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = __importDefault(require("electron"));
const electron_updater_1 = require("electron-updater");
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const { app, BrowserWindow, ipcMain, dialog, shell } = electron_1.default;
const isDev = process.env.NODE_ENV === 'development';
// Configure auto-updater
electron_updater_1.autoUpdater.autoDownload = false; // Don't auto-download, ask user first
electron_updater_1.autoUpdater.autoInstallOnAppQuit = true;
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: (0, node_path_1.join)(__dirname, 'preload.cjs'),
        },
        icon: (0, node_path_1.join)(__dirname, '../public/PurgedIcon.png'),
        title: 'Purge by DevDussey',
        titleBarStyle: 'default',
        show: false,
    });
    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile((0, node_path_1.join)(__dirname, '../dist/index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.on('closed', () => {
        app.quit();
    });
}
app.whenReady().then(() => {
    createWindow();
    // Check for updates after app starts (only in production)
    if (!isDev) {
        setTimeout(() => {
            electron_updater_1.autoUpdater.checkForUpdates();
        }, 3000);
    }
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// Auto-updater event handlers
electron_updater_1.autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: `A new version (${info.version}) is available!`,
        buttons: ['Download', 'Later'],
        defaultId: 0
    }).then((result) => {
        if (result.response === 0) {
            electron_updater_1.autoUpdater.downloadUpdate();
        }
    });
});
electron_updater_1.autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. The app will restart to install the update.',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0
    }).then((result) => {
        if (result.response === 0) {
            electron_updater_1.autoUpdater.quitAndInstall();
        }
    });
});
electron_updater_1.autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err);
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// IPC handlers for script execution
ipcMain.handle('execute-script', async (event, scriptPath, parameters = [], requiresElevation = false) => {
    try {
        // Resolve script path relative to app directory
        const appPath = app.getAppPath();
        const fullScriptPath = (0, node_path_1.resolve)(appPath, scriptPath);
        // Check if script exists
        if (!(0, node_fs_1.existsSync)(fullScriptPath)) {
            return {
                success: false,
                output: '',
                error: `Script not found: ${fullScriptPath}`
            };
        }
        // Prepare PowerShell command
        const args = ['-ExecutionPolicy', 'Bypass', '-File', fullScriptPath, ...parameters];
        let command = 'powershell.exe';
        let spawnArgs = args;
        // Handle elevation requirement
        if (requiresElevation && process.platform === 'win32') {
            // Use PowerShell Start-Process with -Verb RunAs for elevation
            const elevatedScript = `Start-Process PowerShell -ArgumentList "${args.map(arg => `'${arg}'`).join(', ')}" -Verb RunAs -Wait`;
            spawnArgs = ['-Command', elevatedScript];
        }
        return new Promise((resolve) => {
            const child = (0, node_child_process_1.spawn)(command, spawnArgs, {
                stdio: ['pipe', 'pipe', 'pipe'],
                shell: true
            });
            let output = '';
            let error = '';
            child.stdout?.on('data', (data) => {
                output += data.toString();
            });
            child.stderr?.on('data', (data) => {
                error += data.toString();
            });
            child.on('close', (code) => {
                resolve({
                    success: code === 0,
                    output: output.trim(),
                    error: error.trim() || undefined
                });
            });
            child.on('error', (err) => {
                resolve({
                    success: false,
                    output: '',
                    error: err.message
                });
            });
            // Set timeout for long-running scripts
            setTimeout(() => {
                child.kill();
                resolve({
                    success: false,
                    output: output.trim(),
                    error: 'Script execution timed out'
                });
            }, 300000); // 5 minutes timeout
        });
    }
    catch (error) {
        return {
            success: false,
            output: '',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
});
// Handle opening external links
ipcMain.handle('open-external', async (event, url) => {
    await shell.openExternal(url);
});
// Handle showing message boxes
ipcMain.handle('show-message-box', async (event, options) => {
    const result = await dialog.showMessageBox(mainWindow, options);
    return result;
});
// Handle file/folder selection
ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
});
// Get app version
ipcMain.handle('get-app-version', async () => {
    return app.getVersion();
});
// Get app path
ipcMain.handle('get-app-path', async () => {
    return app.getAppPath();
});
// Handle hash computation
ipcMain.handle('compute-hash', async (event, data) => {
    try {
        const buffer = Buffer.from(data);
        const hash = (0, node_crypto_1.createHash)('sha256').update(buffer).digest('hex');
        return hash;
    }
    catch (error) {
        throw new Error(`Hash computation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
// Handle signature verification
ipcMain.handle('verify-signature', async (event, data, signature, publicKey) => {
    try {
        const verify = (0, node_crypto_1.createVerify)('RSA-SHA256');
        verify.update(data);
        return verify.verify(publicKey, signature, 'base64');
    }
    catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
});
// AI Service handlers - simplified for now
ipcMain.handle('ai-chat', async (event, messages, config) => {
    return {
        success: false,
        error: 'AI service not available in production build. Use electron-dev for AI features.'
    };
});
ipcMain.handle('ai-analyze-threat', async (event, threatData, config) => {
    return {
        success: false,
        error: 'AI service not available in production build. Use electron-dev for AI features.'
    };
});
ipcMain.handle('ai-analyze-scan', async (event, scanResults, config) => {
    return {
        success: false,
        error: 'AI service not available in production build. Use electron-dev for AI features.'
    };
});
ipcMain.handle('ai-get-recommendations', async (event, systemData, config) => {
    return {
        success: false,
        error: 'AI service not available in production build. Use electron-dev for AI features.'
    };
});
ipcMain.handle('ai-check-ollama', async (event, config) => {
    return { success: false, available: false };
});
ipcMain.handle('ai-get-ollama-models', async (event, config) => {
    return { success: false, models: [] };
});
// Clipboard handler
ipcMain.handle('read-clipboard', async () => {
    const { clipboard } = electron_1.default;
    return clipboard.readText();
});
// Settings persistence handlers
const settingsPath = (0, node_path_1.join)(app.getPath('userData'), 'settings.json');
ipcMain.handle('get-settings', () => {
    try {
        if ((0, node_fs_1.existsSync)(settingsPath)) {
            const data = (0, node_fs_1.readFileSync)(settingsPath, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Failed to load settings:', error);
    }
    return null;
});
ipcMain.handle('save-settings', async (event, settings) => {
    try {
        const userDataPath = app.getPath('userData');
        if (!(0, node_fs_1.existsSync)(userDataPath)) {
            (0, node_fs_1.mkdirSync)(userDataPath, { recursive: true });
        }
        (0, node_fs_1.writeFileSync)(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
    }
    catch (error) {
        console.error('Failed to save settings:', error);
        throw error;
    }
});
// Manual update check
ipcMain.handle('check-for-updates', async () => {
    if (isDev) {
        return { available: false, message: 'Auto-updates disabled in development mode' };
    }
    try {
        const result = await electron_updater_1.autoUpdater.checkForUpdates();
        return {
            available: result !== null,
            version: result?.updateInfo?.version,
            message: result ? 'Update available' : 'You are on the latest version'
        };
    }
    catch (error) {
        console.error('Update check failed:', error);
        return { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
//# sourceMappingURL=main.js.map