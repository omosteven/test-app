import React from "react";
import { useSelector } from "react-redux";
import { validateEmail } from "utils/helper";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import SmallLoader from "../../../../ui/SmallLoader/SmallLoader";
import "./LiveChatStatusBar.scss";

const { IDLE, LOADING, ERROR, DATAMODE } = dataQueryStatus;

const LiveChatStatusBar = ({ status, errorMssg }) => {
    // const {email} = agent || {}
    const { user } = useSelector((state) => state?.auth);

    // const {
    //     user: { email },
    // } = useSelector((state) => state?.auth);

    const handleRetry = () => {
        window.location.reload();
    };

    const renderBasedOnStatus = () => {
        switch (status) {
            case IDLE:
                return "";

            case LOADING:
                return <SmallLoader otherClassName={"primary"} />;

            case ERROR:
                return (
                    <span className='error__status' onClick={handleRetry}>
                        {errorMssg}
                    </span>
                );

            case DATAMODE:
                return (
                    <span className='connected'>
                        {validateEmail(user?.email)
                            ? user?.email
                            : "Add email address"}
                    </span>
                );

            default:
                return "";
        }
    };

    return <div className='live__chat--status'>{renderBasedOnStatus()}</div>;
};

export default LiveChatStatusBar;
