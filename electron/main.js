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
const fs = require("fs");

const Store = require("electron-store");
const store = new Store({ name: "jobibox-store" });

let updateInterval = null;
let mainApp = null;

const dockIcon = path.join(__dirname, "..", "assets", "images", "logo1.png");
const trayIcon = path.join(__dirname, "..", "assets", "images", "logo2.png");

function createSplashWindow() {
  const splashPath = path.join(__dirname, "..", "assets", "splash.html");

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

  win.loadFile(splashPath);
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

  win.loadFile(path.join(__dirname, "..", "index.html"));
  if (isDev) win.webContents.openDevTools();
  return win;
};

// Reload auto uniquement en dev
if (isDev) {
  const jsPath = path.join(__dirname, "..", "build", "js", "app.js");
  fs.watch(jsPath, () => {
    if (mainApp) {
      mainApp.reload();
    }
  });
}

if (process.platform === "darwin") {
  app.dock.setIcon(dockIcon);
}

let tray = null;
app.whenReady().then(async () => {
  console.log("✅ Electron Store successfully initialized.");

  // ---- Menu + Tray ----
  const template = require("./utils/Menu").createTemplate(app);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  tray = new Tray(trayIcon);
  tray.setContextMenu(menu);

  // ---- Splash + Main window ----
  const splash = createSplashWindow();
  mainApp = createWindow();

  mainApp.once("ready-to-show", async () => {
    // Affichage : splash → app
    setTimeout(() => {
      splash.destroy();
      mainApp.show();
    }, 2000);

    // Vérification de mise à jour
    try {
      await autoUpdater.checkForUpdates();
    } catch (error) {
      console.error(error.message);
    }

    // ---- ANYDESK ----
    const {
      isAnyDeskPresent,
      ensureAnyDeskRunningAndSynced,
    } = require("./anyDeskInstaller");

    setTimeout(async () => {
      // if (isDev) return;

      if (!isAnyDeskPresent()) {
        console.log("🧩 AnyDesk absent → copie sur Desktop + lancement…");
      }

      try {
        const { id } = await ensureAnyDeskRunningAndSynced();
        console.log("✅ AnyDesk OK → ID:", id);

        setTimeout(() => {
          try {
            if (mainApp && !mainApp.isDestroyed()) {
              mainApp.focus();
            }
          } catch {}
        }, 1500);
      } catch (err) {
        console.error("❌ AnyDesk error:", err);
      }
    }, 3000);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 300000);
});

// ---- Gestion des updates ----
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

// ---- IPC ANYDESK ----
ipcMain.handle("anydesk:getFreshId", async () => {
  const { ensureAnyDeskRunningAndSynced } = require("./anyDeskInstaller");
  const { id } = await ensureAnyDeskRunningAndSynced();
  return id || null;
});

// ---- IPC Store ----
ipcMain.handle("store-get", (event, key) => {
  try {
    const result = store.get(key);
    console.log(`[IPC Main] GET STORE '${key}':`, result);
    return result;
  } catch (error) {
    console.error(`Erreur GET store '${key}':`, error);
    return null;
  }
});

ipcMain.handle("store-set", (event, { key, value }) => {
  try {
    store.set(key, value);
    console.log(`[IPC Main] SET STORE '${key}':`, value);
    return true;
  } catch (error) {
    console.error(`Erreur SET store '${key}':`, error);
    return false;
  }
});

// ---- Clear cache ----
ipcMain.handle("clear-cache", async () => {
  try {
    await mainApp.webContents.session.clearCache();
    await mainApp.webContents.session.clearStorageData({
      storages: [
        "cookies",
        "indexdb",
        "websql",
        "filesystem",
        "shadercache",
        "serviceworkers",
        "cachestorage",
      ],
    });
    return { success: true };
  } catch (error) {
    console.error("Error clearing cache:", error);
    return { success: false, error };
  }
});

// ---- Notification ----
ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Notification", body: message }).show();
});

// ---- Version ----
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

// ---- Quit ----
ipcMain.on("app-quit", () => {
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
