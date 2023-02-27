import { useState, useEffect, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../../../lib/socket/context/socket";
import { IS_NOT_TYPING, IS_TYPING } from "../../../../../../lib/socket/events";
import TypingMessageIndicator from "../../../../../ui/TypingMessageIndicator/TypingMessageIndicator";
import { appMessageUserTypes } from "./enums";
import MessagesLayout from "./MessagesLayout/MessagesLayout";
import { messageTypes } from "./enums";
import "./Messages.scss";

const { ACTION_INFO } = messageTypes;

const Messages = ({
    agent,
    ticketId,
    forcedAgentTyping,
    handleMessageOptionSelect,
    handleOptConversation,
    openPreviewModal,
    handleRateConversation,
    handleVerifyAction,
    messages,
    setActiveConvo,
    requestAllMessages,
    handleNewMessage,
    status,
    mssgSendStatus,
}) => {
    const { activeTicket } = useSelector((state) => state.tickets);
    const { agentTyping } = activeTicket || {};
    const [agentIsTyping, sayAgentIsTyping] = useState(agentTyping);

    const socket = useContext(SocketContext);

    let allMessagesCopy = [...messages];
    // let lastAgentMssgHasOptions = [...allMessagesCopy]
    //     .reverse()
    //     ?.find(
    //         (message) =>
    //             message?.branchOptions?.length > 0 &&
    //             Array.isArray(message?.branchOptions) &&
    //             message.senderType === appMessageUserTypes?.WORKSPACE_AGENT
    //     );

    const lastAgentMssgWithOptions = [...allMessagesCopy][
        allMessagesCopy.length - 1
    ];

    const addMargin =
        lastAgentMssgWithOptions?.branchOptions?.length > 0 &&
        Array.isArray(lastAgentMssgWithOptions?.branchOptions) &&
        lastAgentMssgWithOptions?.senderType ===
            appMessageUserTypes?.WORKSPACE_AGENT;

    const handleTypingTrigger = (data) => {
        const { typing, user } = data;
        const { userType } = user;
        if (userType === appMessageUserTypes?.WORKSPACE_AGENT) {
            sayAgentIsTyping(typing);
        }
    };

    useEffect(() => {
        socket.on(IS_TYPING, handleTypingTrigger);
        socket.on(IS_NOT_TYPING, handleTypingTrigger);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sayAgentIsTyping(forcedAgentTyping);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forcedAgentTyping, sayAgentIsTyping]);

    return (
        <div className='d-content'>
            <AnimatePresence>
                {messages?.length > 0 ? (
                    <MessagesLayout
                        messages={messages}
                        agent={agent}
                        handleMessageOptionSelect={handleMessageOptionSelect}
                        handleOptConversation={handleOptConversation}
                        openPreviewModal={openPreviewModal}
                        handleRateConversation={handleRateConversation}
                        handleVerifyAction={handleVerifyAction}
                        setActiveConvo={setActiveConvo}
                        requestAllMessages={requestAllMessages}
                        handleNewMessage={handleNewMessage}
                        mssgSendStatus={mssgSendStatus}
                        status={status}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>

            {agentIsTyping ? (
                <TypingMessageIndicator
                    {...{
                        agent,
                        forcedAgentTyping,
                    }}
                />
            ) : (
                ""
            )}
            <div
                id='dummy'
                className={`${addMargin ? "dummy__margin" : ""}`}></div>
        </div>
    );
};

export default Messages;
