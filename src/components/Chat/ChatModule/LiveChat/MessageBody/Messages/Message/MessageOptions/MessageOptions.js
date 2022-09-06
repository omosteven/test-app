import { messageTypes } from "../../enums";
import MessageBranchOption from "./MessageBranchOption/MessageBranchOption";
import "./MessageOptions.scss";

const { CONVERSATION } = messageTypes;

const MessageOptions = ({
    messageType,
    options,
    handleMessageOptionSelect,
    handleOptConversation,
    selectedOption,
    messageIndex,
    messagesDepth,
}) => {
    return (
        <div className='options__group col-lg-5 col-md-7 col-12'>
            {options?.map((option, index) => (
                <MessageBranchOption
                    key={index}
                    data={option}
                    messageIndex={messageIndex}
                    messagesDepth={messagesDepth}
                    branchOptionId={option?.branchOptionId}
                    selectedOption={selectedOption}
                    handleMessageOptionSelect={() =>
                        messageType === CONVERSATION
                            ? handleOptConversation(option)
                            : handleMessageOptionSelect(option)
                    }
                />
            ))}
        </div>
    );
};

export default MessageOptions;
