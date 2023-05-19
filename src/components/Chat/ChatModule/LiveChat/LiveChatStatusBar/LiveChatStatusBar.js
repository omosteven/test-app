import React from "react";
import { useSelector } from "react-redux";
import imageLinks from "assets/images";
import { validateEmail } from "utils/helper";
import { dataQueryStatus } from "utils/formatHandlers";
import SmallLoader from "components/ui/SmallLoader/SmallLoader";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";
import ChatHeaderBannerMessage from "../../ChatHeader/ChatHeaderBannerMessage/ChatHeaderBannerMessage";
import "./LiveChatStatusBar.scss";

const { IDLE, LOADING, ERROR, DATAMODE } = dataQueryStatus;
const { RELAXED } = defaultTemplates;

const LiveChatStatusBar = ({
    status,
    errorMssg,
    reconnectUser,
    handleAddEmailAction,
}) => {
    const { user } = useSelector((state) => state?.auth);

    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const handleRetry = () => {
        reconnectUser?.();
    };

    const { width } = useWindowSize();

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    // const isWorkModeTemplate = defaultTemplate === WORKMODE;
    const isNotTablet = width > 768;

    const renderBasedOnStatus = () => {
        switch (status) {
            case IDLE:
                return "";

            case LOADING:
                return <SmallLoader otherClassName={"primary"} />;

            case ERROR:
                return (
                    <span className='error__status' onClick={handleRetry}>
                        {isRelaxedTemplate && (
                            <img
                                src={imageLinks?.svg.redRetry}
                                alt='Retry Icon'
                            />
                        )}{" "}
                        {errorMssg}
                    </span>
                );

            case DATAMODE:
                return (
                    <>
                        {!validateEmail(user?.email) ? (
                            <>
                                {isNotTablet ? (
                                    <ChatHeaderBannerMessage
                                        handleVerifyAction={
                                            handleAddEmailAction
                                        }
                                        clickAction={
                                            !validateEmail(user?.email)
                                        }
                                        message={
                                            <>
                                                To save your ticket, click{" "}
                                                <span className='highlight underline'>
                                                    here
                                                </span>{" "}
                                                to confirm your email.
                                            </>
                                        }
                                    />
                                ) : (
                                    <>
                                        {/* {isWorkModeTemplate && (
                                            <span
                                                onClick={handleAddEmailAction}
                                                className='connected pointer'>
                                                Add email address
                                            </span>
                                        )} */}
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {isNotTablet ? (
                                    <ChatHeaderBannerMessage
                                        closeAction={validateEmail(user?.email)}
                                        message={
                                            <>
                                                You can always re-open this
                                                ticket with the link we sent to{" "}
                                                <span className='highlight'>
                                                    {user?.email}
                                                </span>
                                            </>
                                        }
                                    />
                                ) : (
                                    <>
                                        <ChatHeaderBannerMessage
                                            closeAction={validateEmail(
                                                user?.email
                                            )}
                                            className='chat__header__banner__workmode__wrapper'
                                            message={<>Click to view notice</>}
                                        />
                                        {/* {isWorkModeTemplate && (
                                            <span className='connected'>
                                                {user?.email}{" "}
                                            </span>
                                        )} */}
                                    </>
                                )}
                            </>
                        )}
                    </>
                );

            default:
                return "";
        }
    };

    return <div className='live__chat--status'>{renderBasedOnStatus()}</div>;
};

export default LiveChatStatusBar;
