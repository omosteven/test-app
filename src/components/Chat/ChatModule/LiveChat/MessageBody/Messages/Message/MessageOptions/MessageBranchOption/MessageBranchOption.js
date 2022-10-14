import React from "react";
import { INPUT_NEEDED } from "../../../enums";
import "./MessageBranchOption.scss";

const MessageBranchOption = ({
    data: { branchOptionLabel },
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    lastMessage,
}) => {
    const { messageActionType } = lastMessage || {};

    const shouldBeDisabled =
        messageActionType === INPUT_NEEDED
            ? false
            : messageIndex < messagesDepth;
    const isSelected = selectedOption === branchOptionId;

    return (
        <div
            className={`branch__option ${
                selectedOption
                    ? isSelected
                        ? "active"
                        : "__fade_out"
                    : shouldBeDisabled
                    ? "__fade_out"
                    : ""
            }`}
            onClick={() =>
                selectedOption ? null : handleMessageOptionSelect()
            }
            disabled={shouldBeDisabled}>
            {branchOptionLabel}
        </div>
    );
};

export default MessageBranchOption;
