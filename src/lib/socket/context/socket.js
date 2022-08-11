import React from "react";
import { io } from "socket.io-client";
import config from "../../../config/config";
import { retriveAccessToken } from "../../../storage/sessionStorage";

const token = retriveAccessToken();

export const socket = io.connect(config.apiGateway.SOCKET_BASE_URL, {
    extraHeaders: {
        authorization: token,
    },
});

export const SocketContext = React.createContext();
