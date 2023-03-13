import React from "react";
import { io } from "socket.io-client";
import config from "../../../config/config";
import { retriveAccessToken } from "storage/sessionStorage";

const token = retriveAccessToken();

export const socket = io.connect(config.apiGateway.SOCKET_BASE_URL, {
    extraHeaders: {
        authorization: token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
});

export const SocketContext = React.createContext();

export const reconnectSocket = (authToken) => {
    return io.connect(config.apiGateway.SOCKET_BASE_URL, {
        extraHeaders: {
            authorization: authToken,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    });
};
