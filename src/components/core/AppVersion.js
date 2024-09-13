export const AppVersion = async () => {
    const appVersion = await window.electron.appVersionApi.getAppVersion();
    return appVersion; 
};
