import TicketStatus from "../../CustomerTicketsContainer/CustomerTickets/common/TicketStatus/TicketStatus";
import { Info } from "../../../ui";
import ChangeOption from "./ChangeOption/ChangeOption";

const TicketsHeader = ({ ticket, showUndoChoice, setStatus, setErrorMssg, requestAllMessages }) => {
    const { agent, ticketPhase, ticketId } = ticket;
    const { firstName, lastName } = agent;

    return (
        <div
            id='ticketsHeader'
            className='ticket-header'>
            <div className="agent-ticket--status">
                <p className='agents__name'>{`${firstName} ${lastName}`}</p>
                <div className={'d-sm-none'}>
                    <TicketStatus {...{ ticketPhase, ticketId }} />
                </div>
            </div>

            <div className='tickets__action--list'>
                <Info otherClass={'d-none d-sm-block'}>
                    <TicketStatus {...{ ticketPhase, ticketId }} />
                </Info>

                <ChangeOption
                    {
                    ...{
                        ticketId,
                        setStatus,
                        setErrorMssg,
                        requestAllMessages
                    }
                    }
                />
            </div>
        </div>
    );
};

export default TicketsHeader;
