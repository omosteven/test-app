import { getToken, onMessage } from "firebase/messaging";
import config from "../../config/config";

import { firebaseMessaging } from "./config/config";

export const getDevicePushToken = () => {
    return getToken(firebaseMessaging, {
        vapidKey: config.firebase.VAPIDKEY,
    })
        .then((currentToken) => {
            console.log("curren token", currentToken);
            if (currentToken) {
                return currentToken;
            } else {
                return null;
            }
        })
        .catch((err) => {
            console.log("curren error", err);
            return null;
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(firebaseMessaging, (payload) => {
            resolve(payload);
        });
    });
