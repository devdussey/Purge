"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const crypto_1 = require("crypto");
const isDev = process.env.NODE_ENV === 'development';
let mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, '../public/Dusscord.png'),
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
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.on('closed', () => {
        electron_1.app.quit();
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// IPC handlers for script execution
electron_1.ipcMain.handle('execute-script', async (event, scriptPath, parameters = [], requiresElevation = false) => {
    try {
        // Resolve script path relative to app directory
        const appPath = electron_1.app.getAppPath();
        const fullScriptPath = path.resolve(appPath, scriptPath);
        // Check if script exists
        if (!fs.existsSync(fullScriptPath)) {
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
            const child = (0, child_process_1.spawn)(command, spawnArgs, {
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
electron_1.ipcMain.handle('open-external', async (event, url) => {
    await electron_1.shell.openExternal(url);
});
// Handle showing message boxes
electron_1.ipcMain.handle('show-message-box', async (event, options) => {
    const result = await electron_1.dialog.showMessageBox(mainWindow, options);
    return result;
});
// Handle file/folder selection
electron_1.ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, options);
    return result;
});
// Get app version
electron_1.ipcMain.handle('get-app-version', async () => {
    return electron_1.app.getVersion();
});
// Get app path
electron_1.ipcMain.handle('get-app-path', async () => {
    return electron_1.app.getAppPath();
});
// Handle hash computation
electron_1.ipcMain.handle('compute-hash', async (event, data) => {
    try {
        const buffer = Buffer.from(data);
        const hash = (0, crypto_1.createHash)('sha256').update(buffer).digest('hex');
        return hash;
    }
    catch (error) {
        throw new Error(`Hash computation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
// Handle signature verification
electron_1.ipcMain.handle('verify-signature', async (event, data, signature, publicKey) => {
    try {
        const verify = (0, crypto_1.createVerify)('RSA-SHA256');
        verify.update(data);
        return verify.verify(publicKey, signature, 'base64');
    }
    catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
});
//# sourceMappingURL=main.js.map