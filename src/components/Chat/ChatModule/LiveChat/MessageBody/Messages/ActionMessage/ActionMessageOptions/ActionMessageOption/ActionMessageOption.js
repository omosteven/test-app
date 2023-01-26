import React from "react";
import "./ActionMessageOption.scss";

const ActionMessageOption = ({
    branchOptionLabel,
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    actionBranchOptionTitle,
}) => {
    const shouldBeDisabled = messageIndex < messagesDepth;
    const isSelected = selectedOption === branchOptionId;

    return (
        <>
            <div
                className={`branch__option action-message-option ${
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
                {actionBranchOptionTitle
                    ? actionBranchOptionTitle
                    : branchOptionLabel}
            </div>
        </>
    );
};

export default ActionMessageOption;
