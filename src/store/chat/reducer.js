import { SET_CONVERSATION_BREAKERS, UPDATE_CHAT_SETTINGS } from "./types";

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

        default:
            return state;
    }
};

export default ChatReducer;
