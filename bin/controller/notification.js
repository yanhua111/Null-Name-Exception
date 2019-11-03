const { Expo } = require('expo-server-sdk');
const expo = new Expo();

let savedPushTokens = [];

/* Push the saved token */
const push = (token, message) => {
  savedPushTokens = [];
  saveToken(token);
  handlePushTokens(message);
};

/* Save the token received */
const saveToken = (token) => {
  if (savedPushTokens.indexOf(token === -1)) {
    savedPushTokens.push(token);
  }
};

/* Handler for pushing notification with specified message */
const handlePushTokens = (message) => {
  const notifications = [];
  for (const pushToken of savedPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    notifications.push({
      to: pushToken,
      sound: 'default',
      title: 'Message received!',
      body: message,
      data: { message }
    });
  }
  const chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        return error;
      }
    }
  })();
};

module.exports = {
  push
};
