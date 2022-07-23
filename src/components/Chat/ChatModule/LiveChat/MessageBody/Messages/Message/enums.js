export const messageTypes = Object.freeze({
  DEFAULT: "DEFAULT",
  BRANCH: "BRANCH",
  FORM_REQUEST: "FORM_REQUEST",
  CONVERSATION: "CONVERSATION",
  BRANCH_OPTION: "BRANCH_OPTION"
});

export const branchOptionsTypes = Object.freeze({
    LINK: "LINK"
})


export const appMessageUserTypes = Object.freeze({
  WORKSPACE_AGENT: "WORKSPACE_AGENT",
  THIRD_USER: "THIRD_USER",
});

export const messageOptionActions =  Object.freeze({
  CLOSE_CONVERSATION: "CLOSE_CONVERSATION",
  RESTART_CONVERSATION: "RESTART_CONVERSATION"
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
}

// const { TEXT, NUMERIC, LONG_TEXT, VIDEO, IMAGE, MULTISELECT, DATE, END_FORM } = formInputTypes