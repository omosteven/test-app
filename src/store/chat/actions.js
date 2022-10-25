import { SET_CONVERSATION_BREAKERS, UPDATE_CHAT_SETTINGS } from "./types";

export const updateChatSettings = (settings) => (dispatch) =>
    dispatch({ type: UPDATE_CHAT_SETTINGS, payload: settings });

export const setConversationBreakers = (data) => (dispatch) =>
    dispatch({
        type: SET_CONVERSATION_BREAKERS,
        payload: data,
    });
