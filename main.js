const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Menu,
  Tray,
  dialog,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const isDev = !app.isPackaged;
let updateInterval = null;

const dockIcon = path.join(__dirname, "assets", "images", "logo1.png");
const trayIcon = path.join(__dirname, "assets", "images", "logo2.png");

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
    },
  });

  win.loadFile("splash.html");
  return win;
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 1280,
    fullscreen: !isDev,
    autoHideMenuBar: !isDev,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavascript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  
  win.loadFile("index.html");
  isDev && win.webContents.openDevTools();
  return win;
};

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}

if (process.platform === "darwin") {
  app.dock.setIcon(dockIcon);
}

let tray = null;
app.whenReady().then(() => {
  const template = require("./utils/Menu").createTemplate(app);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  tray = new Tray(trayIcon);
  tray.setContextMenu(menu);

  const splash = createSplashWindow();
  const mainApp = createWindow();

  mainApp.once("ready-to-show", () => {
    // splash.destroy();
    // mainApp.show();
    setTimeout(() => {
      splash.destroy();
      mainApp.show();
    }, 2000);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Update app
  updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 300000);

});

// Update app
autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Ok"],
    title: "Mise à jour disponible",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "Une nouvelle version est disponible, elle est en cours de téléchargement.",
  };
  dialog.showMessageBox(dialogOpts);

  updateInterval = null;
});

// Update app
autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Redémarrer", "Plus tard"],
    title: "Installation requise",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "Une mise à jour a été téléchargée. Redémarrez l'application pour l'installer.",
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Notification", body: message }).show();
});

ipcMain.on("app-quit", () => {
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
