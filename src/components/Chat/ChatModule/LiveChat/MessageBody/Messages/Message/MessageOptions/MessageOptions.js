import MessageBranchOption from "./MessageBranchOption/MessageBranchOption";

const MessageOptions = ({ options, handleMessageOptionSelect, selectedOption, messageIndex, messagesDepth}) => {
    return (
        <div className='d-flex w-50 flex-wrap options'>
            {options.map((option, index) => (
                <MessageBranchOption
                    key={index}
                    data={option}
                    messageIndex={messageIndex}
                    messagesDepth={messagesDepth}
                    branchOptionId={option?.branchOptionId}
                    selectedOption={selectedOption}
                    handleMessageOptionSelect={() =>
                        handleMessageOptionSelect(option)
                    }
                />
            ))}
        </div>
    );
};

export default MessageOptions;
