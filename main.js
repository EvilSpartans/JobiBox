const { app, BrowserWindow, ipcMain, Notification, Menu, Tray } = require('electron')
const { updateElectronApp } = require('update-electron-app')
const path = require('path');
const isDev = !app.isPackaged;

const dockIcon = path.join(__dirname, 'assets', 'images', 'logo1.png');
const trayIcon = path.join(__dirname, 'assets', 'images', 'logo2.png');

function createSplashWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    }
  })

  win.loadFile('splash.html')
  return win;
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 1280,
        fullscreen: true,
        autoHideMenuBar: true,
        backgroundColor: "white",
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavascript: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
    isDev && win.webContents.openDevTools();
    return win;
}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

if (process.platform === 'darwin') {
  app.dock.setIcon(dockIcon);
}

let tray = null;
app.whenReady().then(() => {

  const template = require('./utils/Menu').createTemplate(app);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  tray = new Tray(trayIcon);
  tray.setContextMenu(menu);

  const splash = createSplashWindow();
  const mainApp = createWindow();

  mainApp.once('ready-to-show', () => {
    // splash.destroy();
    // mainApp.show();
    setTimeout(() => {
      splash.destroy();
      mainApp.show();
    }, 2000)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  updateElectronApp()
})

ipcMain.on('notify', (_, message) => {
  new Notification({title: 'Notification', body: message}).show();
})

ipcMain.on('app-quit', () => {
  app.quit();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})