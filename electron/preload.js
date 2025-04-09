const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    notificationApi: {
        sendNotification(message) {
            ipcRenderer.send('notify', message);
        }        
    },
    appVersionApi: {
        getAppVersion() {
            return ipcRenderer.invoke('get-app-version');
        }
    },
    clearCache: () => ipcRenderer.invoke('clear-cache')
})