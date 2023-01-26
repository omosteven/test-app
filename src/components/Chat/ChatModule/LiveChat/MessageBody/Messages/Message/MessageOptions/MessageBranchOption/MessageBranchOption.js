import React from "react";
import SmallLoader from "components/ui/SmallLoader/SmallLoader";
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
    mssgOptionLoading,
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
            <span>{branchOptionLabel}</span>
            {mssgOptionLoading && isSelected && (
                <SmallLoader otherClassName='branch__option--loader' />
            )}
        </div>
    );
};

export default MessageBranchOption;
