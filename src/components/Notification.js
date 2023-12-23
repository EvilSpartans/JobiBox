export const sendWelcomeNotification = () => {
    electron.notificationApi.sendNotification('Bienvenue sur Jobibox');
}

export const sendConfirmNotification = () => {
    electron.notificationApi.sendNotification('Votre vidéo est maintenant en ligne !');
}