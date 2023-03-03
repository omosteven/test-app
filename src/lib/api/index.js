import axios from "axios";
import config from "../../config/config";
import { retriveAccessToken, deleteAccessToken } from "storage/cookieStorage";

const API = axios.create({
    baseURL: config?.apiGateway?.BASE_URL,
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
    if (response.status === 401 || response.status === 409) {
        deleteAccessToken();
        window.location.reload();
    }

    return response;
};

const errorHandler = (error) => {
    if (
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        error?.response?.status === 409
    ) {
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
