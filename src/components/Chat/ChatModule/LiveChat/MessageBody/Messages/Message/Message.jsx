import React from "react";
import { appMessageUserTypes, messageTypes } from "./enums";
import { AgentImage } from "../../../../../../ui";
import MessageOptions from "./MessageOptions/MessageOptions";
import MessageContent from "./MessageContent/MessageContent";

const Message = ({ data, agent, handleMessageOptionSelect, handleOptConversation, messageIndex, messagesDepth }) => {
    const { id, senderType, messageType, branchOptions, messageContent, selectedOption } = data;
    const { displayPicture, firstName } = agent;
    const {BRANCH, CONVERSATION} = messageTypes;

    const isReceivedMessage =
        senderType === appMessageUserTypes.WORKSPACE_AGENT;

    return (
        <div 
            id={id}
            className={`message__group ${
                isReceivedMessage ? "receive" : "send text-end"
            }`}>
            {isReceivedMessage && (
                <AgentImage src={displayPicture} alt={firstName} />
            )}
            <div
                className={`d-flex flex-column w-100 ${
                    isReceivedMessage ? "" : "align-items-end"
                }`}>
                <MessageContent
                    isReceivedMessage={isReceivedMessage}
                    messageContent={messageContent}
                />
                 {messageType === CONVERSATION &&
                    branchOptions?.length > 0 && (
                        <MessageOptions
                            selectedOption={selectedOption}
                            options={branchOptions}
                            messageIndex={messageIndex}
                            messagesDepth={messagesDepth}
                            handleMessageOptionSelect={handleOptConversation}
                        />
                    )}
                    
                {messageType === BRANCH &&
                    branchOptions?.length > 0 && (
                        <MessageOptions
                            selectedOption={selectedOption}
                            options={branchOptions}
                            messageIndex={messageIndex}
                            messagesDepth={messagesDepth}
                            handleMessageOptionSelect={handleMessageOptionSelect}
                        />
                    )}
                {/* <span className='text-secondary'>Message seen 1:2pm</span> */}
            </div>
        </div>
    );
};
export default Message;
