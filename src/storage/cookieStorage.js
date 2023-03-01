import Cookies from "js-cookie";

export const setAccessToken = (token) => {
    return Cookies.set("accessToken", token);
};

export const setAuthData = (authData) => {
    const stringifiedData = JSON.stringify(authData);
    return Cookies.set("authData", stringifiedData);
};

export const deleteAccessToken = () => {
    Cookies.remove("accessToken");
};

export const retriveAccessToken = () => {
    try {
        const accessToken = Cookies.get("accessToken");

        return accessToken;
    } catch (err) {
        return undefined;
    }
};

export const retriveAuthData = () => {
    try {
        const authData = Cookies.get("authData");

        const parsedData = JSON.parse(authData);
        return parsedData;
    } catch (err) {
        return undefined;
    }
};
