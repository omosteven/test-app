import { UPDATE_CHAT_SETTINGS } from "./types";

export const updateChatSettings = (settings) => dispatch => dispatch({ type: UPDATE_CHAT_SETTINGS, payload: settings })
