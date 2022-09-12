import { timeSince } from "../../../../../../utils/helper";
import { AgentImage } from "../../../../../ui";
import TicketStatus from "../common/TicketStatus/TicketStatus";
import "./MobileTicket.scss";

const MobileTicket = ({ data, isActive = false, handleTicketSelect }) => {
    const { agent, ticketPhase, ticketId, createdDate } = data;
    const { displayPicture, firstName, lastName } = agent;

    const ticketCreatedSince = timeSince(createdDate);

    return (
        <div
            className={`customer__ticket  ${isActive && "active"}`}
            onClick={() => handleTicketSelect(ticketId)}>
            <div className='row align-items-center'>
                <div className='col-3'>
                    <AgentImage src={displayPicture} alt={firstName} />
                </div>
                <div className='col-9'>
                    <div className='row'>
                        <div className='col-9 ps-0'>
                            <h6 className='agent__name'>{`${firstName} ${lastName}`}</h6>
                            <TicketStatus ticketPhase={ticketPhase} />
                        </div>
                        <div className='col-3 px-0'>
                            <span className='since__when'>
                                {ticketCreatedSince}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileTicket;
