import { motion } from "framer-motion";
import Message from "../MessageBody/Messages/Message/Message";

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

const MessageDemo = ({
    messages,
    agent,
    handleMessageOptionSelect,
    handleOptConversation,
    openPreviewModal,
}) => {
    return (
        <ol className='message-thread'>
            {messages.map((message, i) => {
                //   const isLast = i === messages.length - 1
                //   const noTail = !isLast && messages[i + 1]?.sent === sent
                return (
                    <motion.li
                        key={message?.messageId}
                        //   className={cn(styles.shared, sent ? styles.sent : styles.received, noTail && styles.noTail)}
                        initial='initial'
                        animate='enter'
                        variants={variants}
                        transition={{ duration: 1, delay: 1 }}
                        layout>
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
                    </motion.li>
                );
            })}
        </ol>
    );
};

export default MessageDemo;
