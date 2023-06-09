import { getUniqueListBy, removeDuplicatesBy } from "../../utils/helper";
import * as types from "./types";
import {
    appMessageUserTypes,
    messageTypes,
} from "components/Chat/ChatModule/LiveChat/MessageBody/Messages/enums";

const { THIRD_USER } = appMessageUserTypes;
const { DEFAULT } = messageTypes;

const initialState = {
    ticketsMessages: [],
    activeTicket: {
        agentTyping: false,
    },
};

const TicketsReducer = (state = initialState, { type, payload }) => {
    const { ticketId, messageId, ...otherPayload } = payload || {};
    switch (type) {
        case types.SET_TICKET_MESSAGES:
            let stmProposedVal = getUniqueListBy(
                [...state?.ticketsMessages, ...payload],
                "messageId"
            );

            return {
                ...state,
                ticketsMessages: removeDuplicatesBy(
                    stmProposedVal,
                    "messageContentId"
                ),
            };

        case types.UPDATE_TICKET_MESSAGES:
            let messageIndex = state.ticketsMessages?.findIndex(
                (el) =>
                    el.messageId === payload.messageId &&
                    el.ticketId === payload.ticketId
            );

            if (messageIndex === -1) {
                return {
                    ...state,
                    ticketsMessages: [...state?.ticketsMessages, payload],
                };
            }
            return { ...state };

        case types.DELETE_TICKET_MESSAGE:
            return {
                ...state,
                ticketsMessages: state?.ticketsMessages?.filter(
                    (x) =>
                        !(x.ticketId === ticketId && x.messageId === messageId)
                ),
            };

        case types.UPDATE_TICKET_MESSAGE:
            return {
                ...state,
                ticketsMessages: state?.ticketsMessages?.map((x) => {
                    return x.messageId === messageId && x.ticketId === ticketId
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

        case types.CLEAR_THIRD_USER_MESSAGE:
            return {
                ...state,
                ticketsMessages: state?.ticketsMessages?.filter(
                    (x) =>
                        !(
                            x?.ticketId === payload &&
                            x?.messageType === DEFAULT &&
                            x?.senderType === THIRD_USER
                        )
                ),
            };

        default:
            return state;
    }
};

export default TicketsReducer;
