export const AppVersion = async (): Promise<string> => {
    const appVersion = await (window as any).electron.appVersionApi.getAppVersion();
    return appVersion;
};
  