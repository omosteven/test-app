const enviromentConfi = {
    dev: {
        apiGateway: {
            BASE_URL: process.env.REACT_APP_DEV_API_BASE_URL,
            CLIENT_KEY: process.env.REACT_APP_DEV_CLIENT_KEY,
            SOCKET_BASE_URL: process.env.REACT_APP_DEV_SOCKET_URL,
        },
        firebase: {
            CLIENT_KEY: process.env.REACT_APP_STAGING_FIREBASE_KEY,
            AUTH_DOMAIN: process.env.REACT_APP_STAGING_FIREBASE_AUTHDOMAIN,
            PROJECT_ID: process.env.REACT_APP_STAGING_FIREBASE_PROJECT_ID,
            STORAGE_BUCKET: process.env.REACT_APP_STAGING_FIREBASE_STORAGEBUCKET,
            MESSAGE_SENDER_ID:
                process.env.REACT_APP_STAGING_FIREBASE_MESSAGE_SENDER_ID,
            APP_ID: process.env.REACT_APP_STAGING_FIREBASE_APP_ID,
            MEASUREMENT_ID: process.env.REACT_APP_STAGING_FIREBASE_MEASUREMENT_ID,
            VAPIDKEY: process.env.REACT_APP_STAGING_FIREBASE_VAPIDKEY,
        },
    },
    staging: {
        apiGateway: {
            BASE_URL: process.env.REACT_APP_STAGING_API_BASE_URL,
            CLIENT_KEY: process.env.REACT_APP_STAGING_CLIENT_KEY,
            SOCKET_BASE_URL: process.env.REACT_APP_STAGING_SOCKET_URL,
        },
        firebase: {
            CLIENT_KEY: process.env.REACT_APP_STAGING_FIREBASE_KEY,
            AUTH_DOMAIN: process.env.REACT_APP_STAGING_FIREBASE_AUTHDOMAIN,
            PROJECT_ID: process.env.REACT_APP_STAGING_FIREBASE_PROJECT_ID,
            STORAGE_BUCKET: process.env.REACT_APP_STAGING_FIREBASE_STORAGEBUCKET,
            MESSAGE_SENDER_ID:
                process.env.REACT_APP_STAGING_FIREBASE_MESSAGE_SENDER_ID,
            APP_ID: process.env.REACT_APP_STAGING_FIREBASE_APP_ID,
            MEASUREMENT_ID: process.env.REACT_APP_STAGING_FIREBASE_MEASUREMENT_ID,
            VAPIDKEY: process.env.REACT_APP_STAGING_FIREBASE_VAPIDKEY,
        },
    },
    production: {
        apiGateway: {
            BASE_URL: process.env.REACT_APP_API_BASE_URL,
            CLIENT_KEY: process.env.REACT_APP_CLIENT_KEY,
            SOCKET_BASE_URL: process.env.REACT_APP_SOCKET_URL,
        },
        firebase: {
            CLIENT_KEY: process.env.REACT_APP_STAGING_FIREBASE_KEY,
            AUTH_DOMAIN: process.env.REACT_APP_STAGING_FIREBASE_AUTHDOMAIN,
            PROJECT_ID: process.env.REACT_APP_STAGING_FIREBASE_PROJECT_ID,
            STORAGE_BUCKET: process.env.REACT_APP_STAGING_FIREBASE_STORAGEBUCKET,
            MESSAGE_SENDER_ID:
                process.env.REACT_APP_STAGING_FIREBASE_MESSAGE_SENDER_ID,
            APP_ID: process.env.REACT_APP_STAGING_FIREBASE_APP_ID,
            MEASUREMENT_ID: process.env.REACT_APP_STAGING_FIREBASE_MEASUREMENT_ID,
            VAPIDKEY: process.env.REACT_APP_STAGING_FIREBASE_VAPIDKEY,
        },
    }

}

const config = enviromentConfi[process.env.REACT_APP_STAGE];
const isLiveApp = process.env.REACT_APP_STAGE === "production" || process.env.REACT_APP_STAGE === "staging";

// eslint-disable-next-line import/no-anonymous-default-export
export { config as default, isLiveApp };
