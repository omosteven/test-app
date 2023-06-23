import React from "react";
import { useSelector } from "react-redux";
import { messageTypes } from "../../enums";
import MessageBranchOption from "./MessageBranchOption/MessageBranchOption";
import ScheduledBranchOption from "./ScheduledBranchOption/ScheduledBranchOption";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import PoweredBy from "components/common/PoweredBy/PoweredBy";
import "./MessageOptions.scss";
import { dataQueryStatus } from "utils/formatHandlers";

const { RELAXED } = defaultTemplates;
const { CONVERSATION } = messageTypes;

const { LOADING } = dataQueryStatus;
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
    status,
    mssgSendStatus,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    return (
        <div className='options__container col-lg-5 col-md-7 col-12'>
            <div className='options__group options__group__investigate'>
                {options
                    ?.sort((a, b) => a?.order - b?.order)
                    ?.map((option, index) => {
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
                                status={status}
                                mssgOptionLoading={
                                    isRelaxedTemplate &&
                                    mssgSendStatus === LOADING
                                }
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
                                mssgOptionLoading={
                                    isRelaxedTemplate &&
                                    mssgSendStatus === LOADING
                                }
                                status={status}
                                handleMessageOptionSelect={() =>
                                    messageType === CONVERSATION
                                        ? handleOptConversation(option)
                                        : handleMessageOptionSelect(option)
                                }
                            />
                        );
                    })}
            </div>

            {isRelaxedTemplate && (
                <PoweredBy otherClassName='white__background options__footer' />
            )}
        </div>
    );
};

export default MessageOptions;
