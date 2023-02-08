import { ISSUE_DISCOVERY } from "components/Chat/CustomerTicketsContainer/CustomerTickets/common/TicketStatus/enum";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../../../lib/api";
import apiRoutes from "../../../../../lib/api/apiRoutes";
import { clearTicketMessages } from "../../../../../store/tickets/actions";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import { getErrorMessage } from "../../../../../utils/helper";
import { Button } from "../../../../ui";
import {
    appMessageUserTypes,
    messageTypes,
} from "../../LiveChat/MessageBody/Messages/enums";

const { DEFAULT, BRANCH, FORM_REQUEST, CONVERSATION, ACTION_INFO } =
    messageTypes;
const { LOADING } = dataQueryStatus;
const ChangeOption = ({
    setStatus,
    setActiveConvo,
    setErrorMssg,
    requestAllMessages,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {
        chatSettings: { chatThemeColor },
    } = useSelector((state) => state.chat);
    const { activeTicket: ticket, ticketsMessages } = useSelector(
        (state) => state.tickets
    );
    const { ticketId, ticketPhase } = ticket;
    console.log({ ticketPhase });
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );
    const lastMessage = messages[messages.length - 1];

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
                lastAgentMssg?.messageType === CONVERSATION ||
                lastAgentMssg?.messageType === BRANCH
            ) {
                //
                setActiveConvo(false);
                // return ""
            }

            const url = apiRoutes?.changeTicketChoice(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                requestAllMessages();
                dispatch(clearTicketMessages(ticketId));
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setStatus(dataQueryStatus?.ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const disableChangeChoice =
        lastMessage?.messageType === ACTION_INFO ||
        lastMessage?.messageType === FORM_REQUEST ||
        lastMessage?.messageType === DEFAULT ||
        ticketPhase === ISSUE_DISCOVERY ||
        messages?.length <= 4 ||
        loading;

    console.log({ lastMessage });
    return (
        <div>
            <Button
                text={"Change Choice"}
                classType={"change-choice"}
                onClick={(e) => {
                    e.preventDefault();
                    changeLastBranchOptionChoice();
                }}
                disabled={disableChangeChoice}
                style={{
                    color: chatThemeColor,
                    background: `${chatThemeColor}21`,
                }}
            />
        </div>
    );
};

export default ChangeOption;
