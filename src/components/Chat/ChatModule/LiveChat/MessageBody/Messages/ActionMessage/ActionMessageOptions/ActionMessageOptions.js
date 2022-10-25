import ActionMessageOption from "./ActionMessageOption/ActionMessageOption";
import "./ActionMessageOptions.scss";

const ActionMessageOptions = ({
    actionBranchOptions,
    handleMessageOptionSelect,
    selectedOption,
    messageIndex,
    messagesDepth,
    deliveryDate,
    messageActionBranchId,
}) => {
    return (
        <div className='action-message-options'>
            {actionBranchOptions?.map((actionBranchOption, key) => (
                <ActionMessageOption
                    {...actionBranchOption}
                    key={key}
                    messageIndex={messageIndex}
                    messagesDepth={messagesDepth}
                    selectedOption={selectedOption}
                    handleMessageOptionSelect={() =>
                        handleMessageOptionSelect({
                            branchOptionLabel:
                                actionBranchOption?.actionBranchOptionTitle,
                            messageActionBranchId,
                            branchId: messageActionBranchId,
                            branchOptionId:
                                actionBranchOption?.actionBranchOptionId,
                            branchOptionValue:
                                actionBranchOption?.actionBranchOptionTitle,
                            branchOptionActionType:
                                actionBranchOption?.actionBranchOptionType,
                            ...actionBranchOption,
                        })
                    }
                    deliveryDate={deliveryDate}
                />
            ))}
        </div>
    );
};

export default ActionMessageOptions;
