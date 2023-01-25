import React from "react";
import SmallLoader from "components/ui/SmallLoader/SmallLoader";
import "./ActionMessageOption.scss";

const ActionMessageOption = ({
    branchOptionLabel,
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    actionBranchOptionTitle,
    mssgOptionLoading,
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
                <span
                    className={
                        mssgOptionLoading && isSelected
                            ? "branch__option--hide-on-mobile"
                            : ""
                    }>
                    {actionBranchOptionTitle
                        ? actionBranchOptionTitle
                        : branchOptionLabel}
                </span>
                {mssgOptionLoading && isSelected && (
                    <SmallLoader otherClassName='branch__option--loader' />
                )}
            </div>
        </>
    );
};

export default ActionMessageOption;
