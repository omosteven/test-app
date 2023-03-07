export const storeChatSettings = (chatSettings) => {
    localStorage.setItem("chatSettings", JSON.stringify(chatSettings));
};

export const getChatSettings = () => {
    return JSON.parse(localStorage.getItem("chatSettings"));
};

export const storeUserAuth = (userAuth) => {
    localStorage.setItem("userAuth", JSON.stringify(userAuth));
};

export const getUserAuth = () => {
    return JSON.parse(localStorage.getItem("userAuth"));
};

export const storePinnedConversations = (pinnedConversations) => {
    localStorage.setItem(
        "pinnedConversations",
        JSON.stringify(pinnedConversations)
    );
};

export const getStoredPinnedConversations = () => {
    return JSON.parse(localStorage.getItem("pinnedConversations"));
};
