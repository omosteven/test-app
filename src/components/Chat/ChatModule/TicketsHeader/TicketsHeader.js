import TicketStatus from "../../CustomerTicketsContainer/CustomerTickets/common/TicketStatus/TicketStatus";
import { Info } from "../../../ui";
import ChangeOption from "./ChangeOption/ChangeOption";
import ChatSettingsToggler from "../ChatHeader/ChatSettingsToggler/ChatSettingsToggler";
import "./TicketsHeader.scss";

const TicketsHeader = ({
    ticket,
    showUndoChoice,
    setActiveConvo,
    setStatus,
    setErrorMssg,
    requestAllMessages,
    handleCloseTicket,
}) => {
    const { agent, ticketPhase, ticketId } = ticket;
    const { firstName, lastName } = agent || {};

    return (
        <div id='ticketsHeader' className='ticket-header'>
            <div className='agent-ticket--status'>
                <p className='agents__name'>{`${firstName} ${lastName}`}</p>
                <div>
                    <TicketStatus {...{ ticketPhase, ticketId }} />
                </div>
            </div>

            <div className='tickets__action--list'>
                <Info otherClass={"ticket__status__wrapper"}>
                    <TicketStatus {...{ ticketPhase, ticketId }} />
                </Info>

                <ChangeOption
                    {...{
                        ticketId,
                        setStatus,
                        setErrorMssg,
                        requestAllMessages,
                        setActiveConvo,
                    }}
                />
                <div className='show-only-on-desktop'>
                    <ChatSettingsToggler
                        handleCloseTicket={handleCloseTicket}
                    />
                </div>
            </div>
        </div>
    );
};

export default TicketsHeader;
