import * as types from "./types";

const initialState = {
    ticketsMessages: [],
    activeTicket: {
        agentTyping: false
    }
};

const TicketsReducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case types.UPDATE_TICKET_MESSAGES:
            return { ...state, ticketsMessages: [...state?.ticketsMessages, payload] }

        case types.DELETE_TICKET_MESSAGE:
            const { ticketId, messageId } = payload
            return { ...state, ticketsMessages: state?.ticketsMessages?.filter(x => x.ticketId !== ticketId && x.messageId !== messageId) }

        case types.CLEAR_TICKET_MESSAGES:
            return { ...state, ticketsMessages: state?.ticketsMessages?.filter(x => x.ticketId !== payload) }

        case types.SET_ACTIVE_TICKET:
            return { ...state, activeTicket: { ...payload, agentTyping: false } }

        case type.SET_AGENT_TYPING_TICKET:
            return { ...state, activeTicket: { ...state?.activeTicket, agentTyping: payload } }

        default:
            return state;
    }

};

export default TicketsReducer;
