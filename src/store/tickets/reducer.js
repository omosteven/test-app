import { getUniqueListBy } from "../../utils/helper";
import * as types from "./types";

const initialState = {
    ticketsMessages: [],
    activeTicket: {
        agentTyping: false,
    },
};

const TicketsReducer = (state = initialState, { type, payload }) => {
    const { ticketId, messageContentId, ...otherPayload } = payload || {};
    // console.log(ticketId, messageContentId, otherPayload )
    switch (type) {
        case types.SET_TICKET_MESSAGES:
            return { ...state, ticketsMessages: payload };

        case types.UPDATE_TICKET_MESSAGES:
            return {
                ...state,
                ticketsMessages: [...state?.ticketsMessages, payload],
            };

        case types.DELETE_TICKET_MESSAGE:
            return {
                ...state,
                ticketsMessages: state?.ticketsMessages?.filter(
                    (x) =>
                        x.ticketId !== ticketId &&
                        x.messageContentId !== messageContentId
                ),
            };

        case types.UPDATE_TICKET_MESSAGE:
            return {
                ...state,
                ticketsMessages: state?.ticketsMessages?.map((x) => {
                    return x.messageContentId === messageContentId
                        ? { ...x, ...otherPayload }
                        : x;
                }),
            };

        case types.CLEAR_TICKET_MESSAGES:
            return {
                ...state,
                ticketsMessages: state?.ticketsMessages?.filter(
                    (x) => x.ticketId !== payload
                ),
            };

        case types.SET_ACTIVE_TICKET:
            return {
                ...state,
                activeTicket: { ...payload, agentTyping: false },
            };

        case type.SET_AGENT_TYPING_TICKET:
            return {
                ...state,
                activeTicket: { ...state?.activeTicket, agentTyping: payload },
            };

        default:
            return state;
    }
};

export default TicketsReducer;
