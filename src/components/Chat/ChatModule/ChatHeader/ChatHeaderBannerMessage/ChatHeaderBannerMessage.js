import React, { useState, useEffect } from "react";
import BannerMessage from "components/ui/BannerMessage/BannerMessage";
import "./ChatHeaderBannerMessage.scss";
import {
    getBannerHideStatus,
    setBannerHideStatus,
} from "storage/sessionStorage";

const ChatHeaderBannerMessage = ({
    // showBannerMessage, toggleBannerMessage,
    handleVerifyAction,
    clickAction,
    closeAction,
    message,
    className,
}) => {
    const [showBannerMessage, toggleBannerMessage] = useState(true);

    useEffect(() => {
        const hideBanner = getBannerHideStatus();
        hideBanner ? toggleBannerMessage(false) : toggleBannerMessage(true);
        // eslint-disable-next-line
    }, [message]);

    const handleCloseBanner = () => {
        toggleBannerMessage(false);
        setBannerHideStatus();
    };

    return (
        <div className={className} key={message}>
            {showBannerMessage && (
                <BannerMessage
                    onClick={handleVerifyAction}
                    onClose={() => handleCloseBanner()}
                    isClickable={clickAction}
                    isCloseable={closeAction}>
                    {message}
                </BannerMessage>
            )}
        </div>
    );
};

export default ChatHeaderBannerMessage;
