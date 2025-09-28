import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { createHash, createVerify } from 'crypto';

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
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
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
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

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
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