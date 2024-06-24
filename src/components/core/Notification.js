export const sendWelcomeNotification = () => {
    electron.notificationApi.sendNotification('Bienvenue sur Jobibox');
}

export const sendConfirmNotification = () => {
    electron.notificationApi.sendNotification('Ta vidéo est maintenant en ligne !');
}