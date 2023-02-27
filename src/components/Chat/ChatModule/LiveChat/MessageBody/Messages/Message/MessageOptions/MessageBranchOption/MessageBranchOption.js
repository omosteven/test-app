import React from "react";
import SmallLoader from "components/ui/SmallLoader/SmallLoader";
import { INPUT_NEEDED } from "../../../enums";
import "./MessageBranchOption.scss";
import { dataQueryStatus } from "utils/formatHandlers";

const { ERROR } = dataQueryStatus;
const MessageBranchOption = ({
    data: { branchOptionLabel },
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    lastMessage,
    mssgOptionLoading,
    status,
}) => {
    const { messageActionType } = lastMessage || {};

    const shouldBeDisabled =
        status === ERROR
            ? true
            : messageActionType === INPUT_NEEDED
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
            <span
                className={
                    mssgOptionLoading && isSelected
                        ? "branch__option--hide-on-mobile"
                        : ""
                }>
                {branchOptionLabel}
            </span>
            {mssgOptionLoading && isSelected && (
                <SmallLoader otherClassName='branch__option--loader' />
            )}
        </div>
    );
};

export default MessageBranchOption;
