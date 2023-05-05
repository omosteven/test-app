import axios from "axios";
import config from "../../config/config";
import { retriveAccessToken, deleteAccessToken } from "storage/sessionStorage";

import pushToDashboard from "components/SignInForm/actions";
import apiRoutes from "./apiRoutes";
import { getUserAuth } from "storage/sessionStorage";

const API = axios.create({
    baseURL: config?.apiGateway?.BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "x-request-client-key": config?.apiGateway?.CLIENT_KEY,
    },
});

const requestHandler = (request) => {
    const token = retriveAccessToken();

    if (token) request.headers.Authorization = `Bearer ${token}`;

    return request;
};

const responseHandler = (response) => {
    const { userId, workspaceId } = getUserAuth() || {};

    if (response.status === 401 || response?.status === 409) {
        deleteAccessToken();
        return refreshTokenHandler(userId, workspaceId);
    }

    return response;
};

const refreshTokenHandler = async (appUserId, workspaceId) => {
    try {
        const url = apiRoutes?.validateUser;
        const res = await API.post(url, {
            workspaceId,
            appUserId,
        });

        if (res.status === 201) {
            const { data } = res.data;
            pushToDashboard(data);
            window.location.reload();
        }
    } catch (error) {
        return Promise.reject(error);
    }
};

const errorHandler = (error) => {
    const { userId, workspaceId } = getUserAuth() || {};

    if (error?.response?.status === 401 || error?.response?.status === 409) {
        deleteAccessToken();
        return refreshTokenHandler(userId, workspaceId);
    }

    if (error?.response?.status === 403) {
        deleteAccessToken();
        window.location.reload();
    }

    return Promise.reject(error);
};

API.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);

API.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
);

export default API;
