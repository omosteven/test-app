const MessageBranchOption = ({
    data: { branchOptionLabel },
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
}) => {
    const shouldBeDisabled = messageIndex < messagesDepth;
    const isSelected = selectedOption === branchOptionId;
    return (
        <div
            className={`branch__option ${
                selectedOption ? (isSelected ? "active" : "__fade_out") : ""
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
