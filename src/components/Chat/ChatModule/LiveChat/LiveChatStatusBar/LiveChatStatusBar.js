import React from "react";
import { useSelector } from "react-redux";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import SmallLoader from "../../../../ui/SmallLoader/SmallLoader";
import "./LiveChatStatusBar.scss";

const { IDLE, LOADING, ERROR, DATAMODE } = dataQueryStatus;

const LiveChatStatusBar = ({ status, errorMssg }) => {
    // const {email} = agent || {}
    const {
        user: { email },
    } = useSelector((state) => state?.auth);

    const renderBasedOnStatus = () => {
        switch (status) {
            case IDLE:
                return "";

            case LOADING:
                return <SmallLoader otherClassName={"primary"} />;

            case ERROR:
                return <span className='error'>{errorMssg}</span>;

            case DATAMODE:
                return (
                    <>{email && <span className='connected'>{email}</span>}</>
                );

            default:
                return "";
        }
    };

    return <div className='live__chat--status'>{renderBasedOnStatus()}</div>;
};

export default LiveChatStatusBar;
