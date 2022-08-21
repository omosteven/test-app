import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../../../lib/api";
import apiRoutes from "../../../../../lib/api/apiRoutes";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import { getErrorMessage } from "../../../../../utils/helper";
import { Button } from "../../../../ui";
import {
    appMessageUserTypes,
    messageTypes,
} from "../../LiveChat/MessageBody/Messages/Message/enums";

const { LOADING } = dataQueryStatus;
const ChangeOption = ({
    setStatus,
    setActiveConvo,
    setErrorMssg,
    requestAllMessages,
}) => {
    const [loading, setLoading] = useState(false);
    const {
        chatSettings: { chatThemeColor },
    } = useSelector((state) => state.chat);
    const { activeTicket: ticket, ticketsMessages } = useSelector(
        (state) => state.tickets
    );
    const { ticketId } = ticket;
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );

    const changeLastBranchOptionChoice = async () => {
        try {
            setLoading(true);
            setStatus(LOADING);
            setErrorMssg();

            let allMessagesCopy = [...messages];
            let lastAgentMssg = [...allMessagesCopy]
                .reverse()
                ?.find(
                    (message) =>
                        message.senderType ===
                        appMessageUserTypes?.WORKSPACE_AGENT
                );

            if (
                lastAgentMssg?.messageType === messageTypes.CONVERSATION ||
                lastAgentMssg?.messageType === messageTypes.BRANCH
            ) {
                // console.log("Pause there")
                setActiveConvo(false);
                // return ""
            }

            const url = apiRoutes?.changeTicketChoice(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                requestAllMessages();
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setStatus(dataQueryStatus?.ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    // chatThemeColor
    return (
        <div>
            <Button
                text={"Change Choice"}
                classType={"change-choice"}
                onClick={(e) => {
                    e.preventDefault();
                    changeLastBranchOptionChoice();
                }}
                disabled={loading}
                style={{
                    color: chatThemeColor,
                    background: `${chatThemeColor}21`,
                }}
            />
        </div>
    );
};

export default ChangeOption;
