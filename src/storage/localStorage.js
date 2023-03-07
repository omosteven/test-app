export const storeChatSettings = (data) => {
    let expiry = new Date();
    expiry.setHours(expiry.getHours() + 168);

    let chatSettings = {
        value: data,
        expiry: expiry.getTime(),
    };

    // console.loh('stored now')

    localStorage.setItem("chatSettings", JSON.stringify(chatSettings));
};

export const getChatSettings = () => {
    const currentTime = new Date().getTime();
    const { value, expiry } =
        JSON.parse(localStorage.getItem("chatSettings")) || {};

    if (!value) {
        return null;
    }

    if (currentTime < expiry) {
        return value;
    } else {
        localStorage.removeItem("chatSettings");
        return null;
    }
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
