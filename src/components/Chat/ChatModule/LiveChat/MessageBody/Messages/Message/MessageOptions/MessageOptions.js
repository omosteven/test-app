import React from "react";
import { useSelector } from "react-redux";
import PoweredBy from "components/common/PoweredBy/PoweredBy";
import { messageTypes } from "../../enums";
import MessageBranchOption from "./MessageBranchOption/MessageBranchOption";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import ScheduledBranchOption from "./ScheduledBranchOption/ScheduledBranchOption";
import { useWindowSize } from "utils/hooks";
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
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const { width } = useWindowSize();

    const isTablet = width <= 768;

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
            {defaultTemplate === RELAXED && isTablet && <PoweredBy />}
        </div>
    );
};

export default MessageOptions;
