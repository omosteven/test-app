import {
    appMessageUserTypes,
    messageTypes,
    TICKET_CLOSED_ALERT,
} from "components/Chat/ChatModule/LiveChat/MessageBody/Messages/enums";
import { SocketContext } from "lib/socket/context/socket";
import { CLOSED_TICKET } from "lib/socket/events";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import { saveTicketsMessages } from "store/tickets/actions";
import imageLinks from "../../../../../assets/images";
import TicketStatus from "../common/TicketStatus/TicketStatus";
// import { AgentImage } from "../../../../ui";
// import { timeSince } from "../../../../../utils/helper";

const Ticket = ({
    data,
    isActive = false,
    handleTicketSelect,
    closeTicket,
    getCustomerTickets,
}) => {
    const { agent, ticketPhase, ticketId } = data;
    const { firstName, lastName } = agent;

    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const handleTicketClosure = (ticketStr) => {
        const ticket =
            typeof ticketStr === "string" ? JSON.parse(ticketStr) : ticketStr;

        if (ticket.ticketStatus === false) {
            dispatch(
                saveTicketsMessages({
                    ticketId: ticket?.ticketId,
                    messageId: TICKET_CLOSED_ALERT,
                    messageContent: `How well did you like the experiencesss?`,
                    messageType: messageTypes?.ACTION_INFO,
                    messageActionType: TICKET_CLOSED_ALERT,
                    senderType: appMessageUserTypes?.WORKSPACE_AGENT,
                    deliveryDate: new Date().toISOString(),
                })
            );
            // setTimeout(() => getCustomerTickets(), 50000)
            // console.log("Successfully added support for images")
            console.log("closedagin here");
        }
    };

    useEffect(() => {
        // socket.emit(CLOSED_TICKET, { ticketId });
        socket.on(CLOSED_TICKET, handleTicketClosure);
        return () => {
            socket.off(CLOSED_TICKET);
        };
    }, []);

    return (
        <div
            id={ticketId}
            className={`customer__ticket  ${isActive && "active"}`}
            onClick={() => handleTicketSelect(ticketId)}>
            <div className='d-flex align-items-center w-100'>
                <TicketStatus ticketPhase={ticketPhase} ticketId={ticketId} />

                <div className='close__ticket' onClick={closeTicket}>
                    <ReactSVG
                        src={imageLinks?.svg?.crossIconGrey}
                        className='d-inline-flex'
                    />
                </div>
            </div>
            <h6 className='agent__name'>{`${firstName} ${lastName}`}</h6>
        </div>
    );
};

export default Ticket;
