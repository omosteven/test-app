// import { firebaseConfig } from "../src/lib/firebase/config/config";

// Scripts for firebase and firebase messaging
importScripts(
    "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebaseConfig = {
    apiKey: "AIzaSyA3gJMtC8_nqyyMGG1k4Xjsou0uWYOJ2NQ",
    authDomain: "metacare-610d3.firebaseapp.com",
    projectId: "metacare-610d3",
    storageBucket: "metacare-610d3.appspot.com",
    messagingSenderId: "354799129472",
    appId: "1:354799129472:web:ff25b9163856a3e31ce765",
    measurementId: "G-V65CYV6YWM",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
