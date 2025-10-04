import electron from 'electron';
import type { BrowserWindow as BrowserWindowType } from 'electron';
import { autoUpdater } from 'electron-updater';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash, createVerify } from 'node:crypto';
import { join, resolve } from 'node:path';

const { app, BrowserWindow, ipcMain, dialog, shell } = electron;

const isDev = process.env.NODE_ENV === 'development';

// Configure auto-updater
autoUpdater.autoDownload = false; // Don't auto-download, ask user first
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow: BrowserWindowType;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.cjs'),
    },
    icon: join(__dirname, '../public/PurgedIcon.png'),
    title: 'Purge by DevDussey',
    titleBarStyle: 'default',
    show: false,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
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
  console.log('[Auto-Update] isDev:', isDev);
  console.log('[Auto-Update] Current version:', app.getVersion());

  if (!isDev) {
    console.log('[Auto-Update] Checking for updates in 3 seconds...');
    setTimeout(() => {
      console.log('[Auto-Update] Initiating update check...');
      autoUpdater.checkForUpdates().then((result) => {
        console.log('[Auto-Update] Check result:', result);
      }).catch((err) => {
        console.error('[Auto-Update] Check failed:', err);
      });
    }, 3000);
  } else {
    console.log('[Auto-Update] Skipped - running in development mode');
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
  console.log('[Auto-Update] Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('[Auto-Update] Update available:', info);
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: `A new version (${info.version}) is available!`,
    buttons: ['Download', 'Later'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      console.log('[Auto-Update] User clicked Download');
      autoUpdater.downloadUpdate();
    } else {
      console.log('[Auto-Update] User clicked Later');
    }
  });
});

autoUpdater.on('update-not-available', (info) => {
  console.log('[Auto-Update] Update not available:', info);
});

autoUpdater.on('update-downloaded', () => {
  console.log('[Auto-Update] Update downloaded successfully');
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. The app will restart to install the update.',
    buttons: ['Restart Now', 'Later'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      console.log('[Auto-Update] Restarting to install update...');
      autoUpdater.quitAndInstall();
    } else {
      console.log('[Auto-Update] User postponed installation');
    }
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`[Auto-Update] Download progress: ${progressObj.percent.toFixed(2)}%`);
});

autoUpdater.on('error', (err) => {
  console.error('[Auto-Update] Error:', err);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for script execution
ipcMain.handle('execute-script', async (event, scriptPath: string, parameters: string[] = [], requiresElevation: boolean = false) => {
  try {
    // Resolve script path relative to app directory
    const appPath = app.getAppPath();
    const fullScriptPath = resolve(appPath, scriptPath);

    // Check if script exists
    if (!existsSync(fullScriptPath)) {
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
      const child = spawn(command, spawnArgs, {
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

  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// Handle opening external links
ipcMain.handle('open-external', async (event, url: string) => {
  await shell.openExternal(url);
});

// Handle showing message boxes
ipcMain.handle('show-message-box', async (event, options: any) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// Handle file/folder selection
ipcMain.handle('show-open-dialog', async (event, options: any) => {
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
ipcMain.handle('compute-hash', async (event, data: ArrayBuffer) => {
  try {
    const buffer = Buffer.from(data);
    const hash = createHash('sha256').update(buffer).digest('hex');
    return hash;
  } catch (error) {
    throw new Error(`Hash computation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Handle signature verification
ipcMain.handle('verify-signature', async (event, data: string, signature: string, publicKey: string) => {
  try {
    const verify = createVerify('RSA-SHA256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
});

// AI Service handlers - simplified for now
ipcMain.handle('ai-chat', async (event, messages: Array<{role: string; content: string}>, config: any) => {
  return {
    success: false,
    error: 'AI service not available in production build. Use electron-dev for AI features.'
  };
});

ipcMain.handle('ai-analyze-threat', async (event, threatData: any, config: any) => {
  return {
    success: false,
    error: 'AI service not available in production build. Use electron-dev for AI features.'
  };
});

ipcMain.handle('ai-analyze-scan', async (event, scanResults: any, config: any) => {
  return {
    success: false,
    error: 'AI service not available in production build. Use electron-dev for AI features.'
  };
});

ipcMain.handle('ai-get-recommendations', async (event, systemData: any, config: any) => {
  return {
    success: false,
    error: 'AI service not available in production build. Use electron-dev for AI features.'
  };
});

ipcMain.handle('ai-check-ollama', async (event, config: any) => {
  return { success: false, available: false };
});

ipcMain.handle('ai-get-ollama-models', async (event, config: any) => {
  return { success: false, models: [] };
});

// Clipboard handler
ipcMain.handle('read-clipboard', async () => {
  const { clipboard } = electron;
  return clipboard.readText();
});

// Settings persistence handlers
const settingsPath = join(app.getPath('userData'), 'settings.json');

ipcMain.handle('get-settings', () => {
  try {
    if (existsSync(settingsPath)) {
      const data = readFileSync(settingsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return null;
});

ipcMain.handle('save-settings', async (event, settings: any) => {
  try {
    const userDataPath = app.getPath('userData');
    if (!existsSync(userDataPath)) {
      mkdirSync(userDataPath, { recursive: true });
    }
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  } catch (error) {
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
    const result = await autoUpdater.checkForUpdates();
    return {
      available: result !== null,
      version: result?.updateInfo?.version,
      message: result ? 'Update available' : 'You are on the latest version'
    };
  } catch (error) {
    console.error('Update check failed:', error);
    return { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});