import React from "react";
import { useSelector } from "react-redux";
import { ADD_EMAIL_ADDRESS, messageTypes } from "../../enums";
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
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const {
        activeTicket: { customer },
    } = useSelector((state) => state.tickets);

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    let messageOptions =
        customer?.email?.length === 0
            ? options
            : [
                  ...options,
                  {
                      branchOptionId: ADD_EMAIL_ADDRESS,
                      branchOptionLabel: "Save Chat",
                  },
              ];

    console.log({ messageOptions });

    return (
        <div className='options__group col-lg-5 col-md-7 col-12'>
            {messageOptions?.map((option, index) => {
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
                        handleMessageOptionSelect={() =>
                            messageType === CONVERSATION
                                ? handleOptConversation(option)
                                : handleMessageOptionSelect(option)
                        }
                    />
                );
            })}
            {isRelaxedTemplate && (
                <PoweredBy otherClassName='white__background' />
            )}
        </div>
    );
};

export default MessageOptions;
