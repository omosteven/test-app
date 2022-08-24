import { motion } from "framer-motion";
import ActionMessage from "../ActionMessage/ActionMessage";
import { messageTypes } from "../enums";
import Message from "../Message/Message";
// import { messageTypes } from "../MessageBody/Messages/enums";

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

const MessagesLayout = ({
    messages,
    agent,
    handleMessageOptionSelect,
    handleOptConversation,
    openPreviewModal,
}) => {
    return (
        <ol className='message-thread'>
            {messages.map((message, i) => {
                const {messageType} = message;

                return (
                    <motion.li
                        key={message?.messageId}
                        initial='initial'
                        animate='enter'
                        variants={variants}
                        transition={{ duration: 1.5, delay: 0.5, ...transition }}
                        layout>
                        {
                            messageType === messageTypes?.ACTION_INFO ?
                                <ActionMessage
                                    data={message}
                                    agent={agent}
                                /> :
                                <Message
                                    messageIndex={i + 1}
                                    messagesDepth={messages?.length}
                                    data={message}
                                    agent={agent}
                                    handleMessageOptionSelect={
                                        handleMessageOptionSelect
                                    }
                                    handleOptConversation={handleOptConversation}
                                    openPreviewModal={openPreviewModal}
                                />
                        }
                    </motion.li>
                );
            })}
        </ol>
    );
};

export default MessagesLayout;
