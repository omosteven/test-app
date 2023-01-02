import React from "react";
import { messageTypes } from "../../enums";
import MessageBranchOption from "./MessageBranchOption/MessageBranchOption";
import ScheduledBranchOption from "./ScheduledBranchOption/ScheduledBranchOption";
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
    deliveryDate,
    lastMessage,
}) => {
    return (
        <div className='options__group col-lg-5 col-md-7 col-12'>
            {options?.map((option, index) => {
                return option?.isScheduled ? (
                    <ScheduledBranchOption
                        key={index}
                        data={option}
                        messageIndex={messageIndex}
                        messagesDepth={messagesDepth}
                        branchOptionId={option?.branchOptionId}
                        selectedOption={selectedOption}
                        lastMessage={lastMessage}
                        handleMessageOptionSelect={() =>
                            messageType === CONVERSATION
                                ? handleOptConversation(option)
                                : handleMessageOptionSelect(option)
                        }
                        deliveryDate={deliveryDate}
                    />
                ) : (
                    <MessageBranchOption
                        key={index}
                        data={option}
                        messageIndex={messageIndex}
                        messagesDepth={messagesDepth}
                        branchOptionId={option?.branchOptionId}
                        selectedOption={selectedOption}
                        lastMessage={lastMessage}
                        handleMessageOptionSelect={() =>
                            messageType === CONVERSATION
                                ? handleOptConversation(option)
                                : handleMessageOptionSelect(option)
                        }
                    />
                );
            })}
        </div>
    );
};

export default MessageOptions;
