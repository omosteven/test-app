import * as types from "./types";

export const setTicketMessages = (data) => (dispatch) =>
    dispatch({ type: types.SET_TICKET_MESSAGES, payload: data });
export const saveTicketsMessages = (data) => (dispatch) =>
    dispatch({ type: types.UPDATE_TICKET_MESSAGES, payload: data });
export const deleteTicketsMessages = (data) => (dispatch) =>
    dispatch({ type: types.DELETE_TICKET_MESSAGE, payload: data });
export const updateTicketMessageStatus = (data) => (dispatch) =>
    dispatch({ type: types.UPDATE_TICKET_MESSAGE, payload: data });

export const clearTicketMessages = (data) => (dispatch) =>
    dispatch({ type: types.CLEAR_TICKET_MESSAGES, payload: data });
export const setActiveTicket = (data) => (dispatch) =>
    dispatch({ type: types.SET_ACTIVE_TICKET, payload: data });
export const sayAgentIsTyping = (data) => (dispatch) => {
    dispatch({ type: types.SET_AGENT_TYPING_TICKET, payload: data });
};
export const clearThirdUserMessage = (data) => (dispatch) => {
    dispatch({ type: types.CLEAR_THIRD_USER_MESSAGE, payload: data });
};
