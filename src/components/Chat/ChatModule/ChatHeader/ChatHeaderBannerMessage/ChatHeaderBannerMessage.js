import React, { useState, useEffect } from "react";
import BannerMessage from "components/ui/BannerMessage/BannerMessage";
import "./ChatHeaderBannerMessage.scss";

const ChatHeaderBannerMessage = ({
    handleVerifyAction,
    clickAction,
    closeAction,
    message,
    className,
}) => {
    const [showBannerMessage, toggleBannerMessage] = useState(true);

    useEffect(() => {
        toggleBannerMessage(true);
        // eslint-disable-next-line
    }, [message]);

    return (
        <div className={className} key={message}>
            {showBannerMessage && (
                <BannerMessage
                    onClick={handleVerifyAction}
                    onClose={() => toggleBannerMessage(false)}
                    isClickable={clickAction}
                    isCloseable={closeAction}>
                    {message}
                </BannerMessage>
            )}
        </div>
    );
};

export default ChatHeaderBannerMessage;