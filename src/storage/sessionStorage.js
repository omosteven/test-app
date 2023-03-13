export const storeUserAuth = (userAuth) => {
    sessionStorage.setItem("userAuth", JSON.stringify(userAuth));
};

export const getUserAuth = () => {
    return JSON.parse(sessionStorage.getItem("userAuth"));
};

export const setAccessToken = (token) => {
    return sessionStorage.setItem("accessToken", token);
};

export const retriveAccessToken = () => {
    return sessionStorage.getItem("accessToken");
};

export const deleteAccessToken = () => {
    sessionStorage.removeItem("accessToken");
};
