import axios from "axios";
import config from "../../config/config";
import { retriveAccessToken } from "../../storage/sessionStorage"

const deleteAccessToken = () => sessionStorage.clear();

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
    if (response.status === 401) {
        deleteAccessToken();
    }

    return response;
};

const errorHandler = (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
        deleteAccessToken();
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
