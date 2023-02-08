import React from "react";
import { useSelector } from "react-redux";
import { messageTypes } from "../../enums";
import MessageBranchOption from "./MessageBranchOption/MessageBranchOption";
import ScheduledBranchOption from "./ScheduledBranchOption/ScheduledBranchOption";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import PoweredBy from "components/common/PoweredBy/PoweredBy";
import "./MessageOptions.scss";

const { RELAXED } = defaultTemplates;
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
    mssgOptionLoading,
    mssgOptionError,
    status,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    return (
        <div className='options__group options__group__investigate col-lg-5 col-md-7 col-12'>
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
                        mssgOptionLoading={mssgOptionLoading}
                        status={status}
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
                        mssgOptionLoading={mssgOptionLoading}
                        status={status}
                        handleMessageOptionSelect={() =>
                            messageType === CONVERSATION
                                ? handleOptConversation(option)
                                : handleMessageOptionSelect(option)
                        }
                    />
                );
            })}
            {mssgOptionError && (
                <p className='options__group__error'>An error occurred</p>
            )}
            {isRelaxedTemplate && (
                <PoweredBy otherClassName='white__background' />
            )}
        </div>
    );
};

export default MessageOptions;
