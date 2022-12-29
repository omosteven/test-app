import {
    SET_CONVERSATION_BREAKERS,
    UPDATE_CHAT_SETTINGS,
    CHANGE_THEME,
} from "./types";

const initialState = {
    chatSettings: {
        workspaceSlug: "",
    },
};

const ChatReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case UPDATE_CHAT_SETTINGS:
            return { ...state, chatSettings: payload };

        case SET_CONVERSATION_BREAKERS:
            return { ...state, conversationBreakers: payload };

        case CHANGE_THEME:
            return {
                ...state,
                chatSettings: { ...state?.chatSettings, defaultTheme: payload },
            };

        default:
            return state;
    }
};

export default ChatReducer;
