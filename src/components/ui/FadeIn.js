import {
    TransitionGroup,
    Transition as ReactTransition,
} from "react-transition-group";

const TIMEOUT = 500
const getTransitionStyles = {
    entering: {
        position: `absolute`,
        height: '100%',
        opacity: 0,
        // transform: `translateX(50px)`,
    },
    entered: {
        transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
        height: '100%',
        opacity: 1,
        // transform: `translateX(0px)`,
    },
    exiting: {
        height: '100%',
        transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
        opacity: 0,
        // transform: `translateX(-50px)`,
    },
}

const FadeIn = ({ children, location,...rest }) => {
    return (
        <TransitionGroup style={{ position: "relative", height: "100%"}}>
            <ReactTransition
                key={location}
                timeout={{
                    enter: TIMEOUT,
                    exit: TIMEOUT,
                }}
            >
                {status => (
                    <div
                        style={{
                            ...getTransitionStyles[status],
                        }}
                        {...rest}
                    >
                        {children}
                    </div>
                )}
            </ReactTransition>
        </TransitionGroup>
    )
}
export default FadeIn