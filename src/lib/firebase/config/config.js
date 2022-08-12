import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import config from "../../../config/config";

const {
    CLIENT_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGE_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
} = config.firebase;

export const firebaseConfig = {
    apiKey: CLIENT_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseMessaging = getMessaging(firebaseApp);
