export const TICKET_CLOSED_ALERT = "TICKET_CLOSED_ALERT";
export const AGENT_FOLLOWUP = "AGENT_FOLLOWUP";
export const FORM_FILLED_COMPLETELY = "FORM_FILLED_COMPLETELY";
export const ADD_EMAIL_ADDRESS = "ADD_EMAIL_ADDRESS";
export const DOWNTIME_BRANCH = "DOWNTIME_BRANCH";
export const INPUT_NEEDED = "INPUT_NEEDED";
export const AGENT_UNAVAILABLE = "AGENT_UNAVAILABLE";
export const DOWNTIME_BRANCH_SUB_SENTENCE = "DOWNTIME_BRANCH_SUB_SENTENCE";
export const CONVERSATION_SAVED = "CONVERSATION_SAVED";

export const messageActionTypes = Object.freeze({
    [TICKET_CLOSED_ALERT]: {
        title: `This ticket has been closed`,
    },
    [AGENT_FOLLOWUP]: {
        title: `Connecting you to an agent`,
    },
    [FORM_FILLED_COMPLETELY]: {
        title: `Form filled completely`,
        content: "Thank you, we would get back to you with an update soon. ",
    },
    [ADD_EMAIL_ADDRESS]: {
        title: "Add email address",
        content:
            "Please add and verify your email address so we can also reach you via email with an update",
    },
    [DOWNTIME_BRANCH]: {
        title: "Oops, there’s an issue here",
        content:
            "We are currently experiencing a downtime, please be patient while we fix this issue.",
    },
    [DOWNTIME_BRANCH_SUB_SENTENCE]: {
        title: "We’re currently fixing the issue",
        content:
            "We are currently experiencing a downtime, please be patient while we fix this issue.",
    },
});

export const messageTypes = Object.freeze({
    DEFAULT: "DEFAULT",
    BRANCH: "BRANCH",
    FORM_REQUEST: "FORM_REQUEST",
    FORM_RESPONSE: "FORM_RESPONSE",
    CONVERSATION: "CONVERSATION",
    BRANCH_OPTION: "BRANCH_OPTION",
    COLLECTION: "COLLECTION",
    BRANCH_SUB_SENTENCE: "BRANCH_SUB_SENTENCE",
    ACTION_INFO: "ACTION_INFO",
    UPTIME_BRANCH: "UPTIME_BRANCH",
    UPTIME_BRANCH_SUB_SENTENCE: "UPTIME_BRANCH_SUB_SENTENCE",
    DOWNTIME_BRANCH: "DOWNTIME_BRANCH",
    DOWNTIME_BRANCH_SUB_SENTENCE: "DOWNTIME_BRANCH_SUB_SENTENCE",
    FORM_FILLED: "FORM_FILLED",
    FORM_FILLED_COMPLETELY: "FORM_FILLED_COMPLETELY",
    CANNED_RESPONSE: "CANNED_RESPONSE",
    SUCCESS: "SUCCESS",
});

export const branchOptionsTypes = Object.freeze({
    LINK: "LINK",
});

export const messageStatues = Object.freeze({
    SENDING: "SENDING",
    DELIVERED: "DELIVERED",
    FAILED: "FAILED",
});

export const appMessageUserTypes = Object.freeze({
    WORKSPACE_AGENT: "WORKSPACE_AGENT",
    THIRD_USER: "THIRD_USER",
});

export const messageOptionActions = Object.freeze({
    CLOSE_CONVERSATION: "CLOSE_CONVERSATION",
    RESTART_CONVERSATION: "RESTART_CONVERSATION",
    OPEN_NEW_TICKET: "OPEN_NEW_TICKET",
    ADD_EMAIL_ADDRESS: "ADD_EMAIL_ADDRESS",
    CLOSE_TICKET: "CLOSE_TICKET",
    FORWARD_AGENT: "FORWARD_AGENT",
});

export const formInputTypes = {
    TEXT: "TEXT",
    NUMERIC: "NUMERIC",
    LONG_TEXT: "LONG_TEXT",
    VIDEO: "VIDEO",
    IMAGE: "IMAGE",
    MULTISELECT: "MULTISELECT",
    DATE: "DATE",
    END_FORM: "END_FORM",
};

// const { TEXT, NUMERIC, LONG_TEXT, VIDEO, IMAGE, MULTISELECT, DATE, END_FORM } = formInputTypes
