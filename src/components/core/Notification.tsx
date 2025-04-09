export const sendWelcomeNotification = () => {
    // @ts-ignore
    electron.notificationApi.sendNotification('Bienvenue sur Jobibox');
}

export const sendConfirmNotification = () => {
    // @ts-ignore
    electron.notificationApi.sendNotification('Ta vidéo est maintenant en ligne !');
}