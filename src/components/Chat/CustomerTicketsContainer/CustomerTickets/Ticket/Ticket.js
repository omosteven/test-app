import { SocketContext } from "lib/socket/context/socket";
import { CLOSED_TICKET } from "lib/socket/events";
import { useContext, useEffect } from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
import TicketStatus from "../common/TicketStatus/TicketStatus";
// import { AgentImage } from "../../../../ui";
// import { timeSince } from "../../../../../utils/helper";

const Ticket = ({ data, isActive = false, handleTicketSelect, closeTicket }) => {
    const { agent, ticketPhase, ticketId } = data;
    const { firstName, lastName } = agent;

    const socket = useContext(SocketContext);

    const handleTicketClosure = (details) => {
        console.log('seems like this ticket got closed');
        console.log(details)
    }

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
            <div className="d-flex align-items-center w-100">
                <TicketStatus ticketPhase={ticketPhase} ticketId={ticketId} />

                <div className="close__ticket" onClick={closeTicket}>
                    <ReactSVG
                        src={imageLinks?.svg?.crossIconGrey}
                        className="d-inline-flex"
                    />
                </div>

            </div>
            <h6 className='agent__name'>{`${firstName} ${lastName}`}</h6>
        </div>
    );
};

export default Ticket;
