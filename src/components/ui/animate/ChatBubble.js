import { motion } from "framer-motion"

const transition = {

    type: 'spring',
    stiffness: 200,
    mass: 0.2,
    damping: 20,
}

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
    exiting: {
        opacity: 0,
        y: 300,
        transition
    }

}

const ChatBubble = ({ children, id }) => {

    return (
        <motion.div
            key={id}
            initial="initial"
            animate="enter"
            exit="exiting"
            variants={variants}
            // layout
            transition={{ duration: 5 }}
        >
            {children}
        </motion.div>
    )
}
export default ChatBubble