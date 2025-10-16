const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
 notificationApi: {
  sendNotification(message) {
   ipcRenderer.send("notify", message);
  },
 },
 appVersionApi: {
  getAppVersion() {
   return ipcRenderer.invoke("get-app-version");
  },
 },
 storeApi: {
  get: (key) => ipcRenderer.invoke("store-get", key),
  set: (key, value) => ipcRenderer.invoke("store-set", { key, value }),
 },
 clearCache: () => ipcRenderer.invoke("clear-cache"),
});
