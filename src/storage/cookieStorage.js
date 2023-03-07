import Cookies from "js-cookie";

export const setAccessToken = (token) => {
    return Cookies.set("accessToken", token);
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
