export const storeUserAuth = (userAuth) => {
    sessionStorage.setItem("userAuth", JSON.stringify(userAuth));
};

export const getUserAuth = () => {
    try {
        const userAuth = sessionStorage.getItem("userAuth");

        return JSON.parse(userAuth);
    } catch (err) {
        return undefined;
    }
};

export const setAccessToken = (token) => {
    return sessionStorage.setItem("accessToken", token);
};

export const retriveAccessToken = () => {
    try {
        const accessToken = sessionStorage.getItem("accessToken");

        return accessToken;
    } catch (err) {
        return undefined;
    }
};

export const deleteAccessToken = () => {
    sessionStorage.removeItem("accessToken");
};

export const storeConversationData = (ticket) => {
    sessionStorage.setItem(
        "conversationData",
        JSON.stringify({
            ticketId: ticket?.ticketId,
            conversationId: ticket?.conversationId,
        })
    );
};

export const getConversationData = () => {
    try {
        const accessToken = sessionStorage.getItem("accessToken");

        return JSON.parse(accessToken);
    } catch (err) {
        return undefined;
    }
};

export const setBannerHideStatus = () => {
    sessionStorage.setItem("isBannerHidden", true);
};

export const getBannerHideStatus = () => {
    try {
        return JSON.parse(sessionStorage.getItem("isBannerHidden"));
    } catch (err) {
        return false;
    }
};
