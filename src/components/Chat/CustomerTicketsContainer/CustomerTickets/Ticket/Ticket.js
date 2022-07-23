import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
import TicketStatus from "../common/TicketStatus/TicketStatus";
// import { AgentImage } from "../../../../ui";
// import { timeSince } from "../../../../../utils/helper";

const Ticket = ({ data, isActive = false, handleTicketSelect, closeTicket }) => {
    const { agent, ticketPhase, ticketId } = data;
    const { firstName, lastName } = agent;


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
