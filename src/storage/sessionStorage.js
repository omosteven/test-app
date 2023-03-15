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
    return JSON.parse(sessionStorage.getItem("conversationData"));
};
