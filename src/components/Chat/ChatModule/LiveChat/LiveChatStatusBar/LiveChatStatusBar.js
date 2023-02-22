import React from "react";
import { useSelector } from "react-redux";
import imageLinks from "assets/images";
import { validateEmail } from "utils/helper";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import SmallLoader from "../../../../ui/SmallLoader/SmallLoader";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";
import "./LiveChatStatusBar.scss";

const { IDLE, LOADING, ERROR, DATAMODE } = dataQueryStatus;
const { WORKMODE, RELAXED } = defaultTemplates;

const LiveChatStatusBar = ({
    status,
    errorMssg,
    reconnectUser,
    handleAddEmailAction,
    handleConvoBreaker,
}) => {
    const { user } = useSelector((state) => state?.auth);

    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const { width } = useWindowSize();

    const handleRetry = () => {
        // window.location.reload();
        reconnectUser?.();
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORKMODE;
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
                            <img src={imageLinks?.svg.redRetry} />
                        )}{" "}
                        {errorMssg}
                    </span>
                );

            case DATAMODE:
                return (
                    <>
                        {(isWorkModeTemplate || isNotTablet) && (
                            <>
                                {validateEmail(user?.email) ? (
                                    <span className='connected'>
                                        {user?.email}{" "}
                                    </span>
                                ) : (
                                    <span
                                        onClick={handleAddEmailAction}
                                        className='connected pointer'>
                                        Add email address
                                    </span>
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
