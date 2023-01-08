import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ActionMessage from "../ActionMessage/ActionMessage";
import { messageTypes } from "../enums";
import Message from "../Message/Message";
import SuccessMessage from "../SuccessMessage/SuccessMessage";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
// import { messageTypes } from "../MessageBody/Messages/enums";
import "./MessagesLayout.scss";

const { RELAXED } = defaultTemplates;

const transition = {
    type: "spring",
    stiffness: 200,
    mass: 0.2,
    damping: 20,
};

const variants = {
    initial: {
        opacity: 0,
        y: 300,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition,
    },
};

const { ACTION_INFO, SUCCESS } = messageTypes;

const MessagesLayout = ({
    messages,
    agent,
    handleMessageOptionSelect,
    handleOptConversation,
    openPreviewModal,
    handleRateConversation,
    handleVerifyAction,
    setActiveConvo,
    requestAllMessages,
}) => {
    const { defaultTemplate } = useSelector((state) => state.chat.chatSettings);

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    return (
        <ol className='message-thread'>
            {messages.map((message, i) => {
                const { messageType } = message;

                return (
                    <motion.li
                        key={message?.messageId}
                        initial='initial'
                        animate='enter'
                        variants={isRelaxedTemplate ? {} : variants}
                        transition={
                            isRelaxedTemplate
                                ? {}
                                : {
                                      duration: 1.5,
                                      delay: 0.5,
                                      ...transition,
                                  }
                        }
                        layout>
                        {messageType === ACTION_INFO ? (
                            <ActionMessage
                                data={message}
                                agent={agent}
                                handleRating={handleRateConversation}
                                handleVerifyAction={handleVerifyAction}
                                messageIndex={i + 1}
                                messagesDepth={messages?.length}
                                handleMessageOptionSelect={
                                    handleMessageOptionSelect
                                }
                                handleOptConversation={handleOptConversation}
                                openPreviewModal={openPreviewModal}
                            />
                        ) : messageType === SUCCESS ? (
                            <SuccessMessage data={message} />
                        ) : (
                            <Message
                                messageIndex={i + 1}
                                messagesDepth={messages?.length}
                                data={message}
                                messages={messages}
                                agent={agent}
                                handleMessageOptionSelect={
                                    handleMessageOptionSelect
                                }
                                handleOptConversation={handleOptConversation}
                                openPreviewModal={openPreviewModal}
                                setActiveConvo={setActiveConvo}
                                requestAllMessages={requestAllMessages}
                            />
                        )}
                    </motion.li>
                );
            })}
        </ol>
    );
};

export default MessagesLayout;
