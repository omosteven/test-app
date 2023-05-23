import { getToken, onMessage } from "firebase/messaging";
import config from "../../config/config";

import { firebaseMessaging } from "./config/config";

export const getDevicePushToken = async () => {
    return getToken(await firebaseMessaging, {
        vapidKey: config.firebase.VAPIDKEY,
    })
        .then((currentToken) => {
            if (currentToken) {
                return currentToken;
            } else {
                return null;
            }
        })
        .catch((err) => {
            return null;
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(firebaseMessaging, (payload) => {
            resolve(payload);
        });
    });
