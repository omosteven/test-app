import React from "react";
import { useSelector } from "react-redux";
import imageLinks from "assets/images";
import { validateEmail } from "utils/helper";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import SmallLoader from "../../../../ui/SmallLoader/SmallLoader";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";
import "./LiveChatStatusBar.scss";
import { Button } from "components/ui";

import assets from "assets/images";
import { ReactSVG } from "react-svg";
import { useState } from "react";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { CONVERSATION_SAVED } from "../MessageBody/Messages/enums";

const { IDLE, LOADING, ERROR, DATAMODE } = dataQueryStatus;
const { WORK_MODE, RELAXED } = defaultTemplates;

const LiveChatStatusBar = ({
    status,
    errorMssg,
    reconnectUser,
    handleAddEmailAction,
    handleConvoBreaker,
}) => {
    // const {email} = agent || {}
    // const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state?.auth);
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const [saveStatus, setSaveStatus] = useState();

    const {
        activeTicket: { customer, ticketId },
    } = useSelector((state) => state.tickets);

    const { width } = useWindowSize();

    // const {
    //     user: { email },
    // } = useSelector((state) => state?.auth);

    const handleRetry = () => {
        // window.location.reload();
        reconnectUser?.();
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORK_MODE;
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

    const saveTicketConvo = async () => {
        try {
            setSaveStatus(LOADING);
            let request = {
                ticketId,
                message: `Your Ticket has been saved. Kindly click the button below to go back to it later`,
            };

            const url = apiRoutes?.sendTicketReminder;
            const res = await API.post(url, request);
            if (res.status === 201) {
                setSaveStatus(DATAMODE);
                handleConvoBreaker(CONVERSATION_SAVED);
            }
        } catch (err) {
            setSaveStatus(ERROR);
        }
    };

    const handleSaveConvo = () => {
        customer?.email?.length > 0
            ? saveTicketConvo()
            : handleAddEmailAction();
    };

    return (
        <div className='live__chat--status'>
            {renderBasedOnStatus()}
            {/* {saveStatus !== DATAMODE && (
                <div>
                    <Button
                        type='button'
                        classType='primary'
                        onClick={() => handleSaveConvo()}
                        text='Save Conversation'
                        className='live__chat--save-button'
                        loading={saveStatus === LOADING}
                        disabled={saveStatus === LOADING}
                        icon={
                            <ReactSVG
                                src={assets.svg.save}
                                className='live__chat--save-button__icon'
                            />
                        }
                    />
                </div>
            )} */}
        </div>
    );
};

export default LiveChatStatusBar;
