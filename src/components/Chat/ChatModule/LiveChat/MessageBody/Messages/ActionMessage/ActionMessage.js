import React from "react";
import { useSelector } from "react-redux";
import { AgentImage } from "components/ui";
import { ADD_EMAIL_ADDRESS, AGENT_FOLLOWUP, messageTypes } from "../enums";
import MessageContent from "../Message/MessageContent/MessageContent";
import MessageTimeStatus from "../Message/MessageTimeStatus/MessageTimeStatus";
import ActionMessageContent from "./ActionMessageContent/ActionMessageContent";
import ActionResponseTime from "./ActionMessageContent/ActionResponseTime/ActionResponseTime";
import ActionMessageOptions from "./ActionMessageOptions/ActionMessageOptions";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";

const { WORK_MODE } = defaultTemplates;

const ActionMessage = ({
    data,
    agent,
    handleRating,
    handleVerifyAction,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    openPreviewModal,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const {
        messageRefContent,
        messageId,
        messageContent,
        messageActionType,
        messageHeader,
        selectedActionOption,
        messageType,
        deliveryDate,
        messageActionData,
        fileAttachments,
        branchOptions,
        ticketId,
    } = data;
    const { displayPicture, firstName } = agent || {};

    const parsedBranchOptions =
        typeof branchOptions === "string"
            ? JSON.parse(branchOptions)
            : branchOptions;

    const {
        displayAverageResponseTime,
        actionBranchId,
        requestRatings,
        averageResponseTime,
    } = messageActionData || {};

    const showMessageRefContent =
        defaultTemplate === WORK_MODE && messageRefContent;

    return (
        <div
            id={messageId ? messageId : ""}
            className={`message__group received`}>
            {defaultTemplate === WORK_MODE && (
                <AgentImage src={displayPicture} alt={firstName} />
            )}

            <div className={`message__group--content `}>
                {(showMessageRefContent || fileAttachments) && (
                    <MessageContent
                        isReceivedMessage={false}
                        messageContent={messageRefContent}
                        otherClassNames={"grayed__out"}
                        fileAttachments={fileAttachments}
                        openPreviewModal={openPreviewModal}
                    />
                )}

                <ActionMessageContent
                    messageContent={messageContent}
                    messageId={messageId}
                    messageActionType={messageActionType}
                    handleRating={handleRating}
                    handleVerifyAction={handleVerifyAction}
                    messageHeader={messageHeader}
                    requestRatings={requestRatings}
                    ticketId={ticketId}
                />

                {displayAverageResponseTime &&
                    messageActionType === AGENT_FOLLOWUP && (
                        <ActionResponseTime
                            averageResponseTime={averageResponseTime}
                        />
                    )}

                {parsedBranchOptions?.length > 0 &&
                    messageActionType !== ADD_EMAIL_ADDRESS && (
                        <ActionMessageOptions
                            actionBranchOptions={parsedBranchOptions}
                            selectedOption={selectedActionOption}
                            messageIndex={messageIndex}
                            messagesDepth={messagesDepth}
                            messageType={messageType}
                            handleMessageOptionSelect={
                                handleMessageOptionSelect
                            }
                            deliveryDate={deliveryDate}
                            messageActionBranchId={actionBranchId}
                        />
                    )}

                {messageType !== messageTypes?.BRANCH_SUB_SENTENCE && (
                    <>
                        <MessageTimeStatus date={deliveryDate} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ActionMessage;
