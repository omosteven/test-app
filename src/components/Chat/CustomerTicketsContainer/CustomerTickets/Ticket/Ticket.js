import {
    appMessageUserTypes,
    messageTypes,
    TICKET_CLOSED_ALERT,
} from "components/Chat/ChatModule/LiveChat/MessageBody/Messages/enums";
import { SocketContext } from "lib/socket/context/socket";
import { CLOSED_TICKET } from "lib/socket/events";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import { saveTicketsMessages } from "store/tickets/actions";
import imageLinks from "../../../../../assets/images";
import TicketStatus from "../common/TicketStatus/TicketStatus";
import { AgentImage } from "components/ui";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";

const { ACTION_INFO } = messageTypes;
const { RELAXED, WORK_MODE } = defaultTemplates;

const Ticket = ({
    data,
    isActive = false,
    handleTicketSelect,
    closeTicket,
    getCustomerTickets,
}) => {
    const { agent, ticketPhase, ticketId } = data;
    const { firstName, lastName, displayPicture } = agent;
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const { width } = useWindowSize();

    const isTablet = width <= 768;

    const { conversationBreakers } = useSelector((state) => state.chat);

    const getConvoBreaker = (actionBranchType) => {
        return conversationBreakers?.find(
            (x) => x.actionBranchType === actionBranchType
        );
    };

    const handleTicketClosure = (ticketStr) => {
        const ticket =
            typeof ticketStr === "string" ? JSON.parse(ticketStr) : ticketStr;

        if (ticket.ticketStatus === false) {
            const {
                actionBranchHeader,
                displayAverageResponseTime,
                actionBranchMainSentence,
                actionBranchOptions,
                actionBranchType,
                actionBranchId,
                requestRatings,
            } = getConvoBreaker(TICKET_CLOSED_ALERT);
            dispatch(
                saveTicketsMessages({
                    ticketId: ticket?.ticketId,
                    messageId: actionBranchId,
                    messageContent: actionBranchMainSentence,
                    messageHeader: actionBranchHeader,
                    messageType: ACTION_INFO,
                    messageActionType: actionBranchType,
                    senderType: appMessageUserTypes?.WORKSPACE_AGENT,
                    branchOptions: actionBranchOptions,
                    messageActionData: {
                        displayAverageResponseTime,
                        actionBranchId,
                        requestRatings,
                    },
                    deliveryDate: new Date().toISOString(),
                })
            );
            // setTimeout(() => getCustomerTickets(), 50000)
        }
    };

    useEffect(() => {
        // socket.emit(CLOSED_TICKET, { ticketId });
        socket.on(CLOSED_TICKET, handleTicketClosure);
        return () => {
            socket.off(CLOSED_TICKET);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORK_MODE;

    return (
        <div
            id={ticketId}
            className={`customer__ticket  ${isActive && "active"}`}
            onClick={() => handleTicketSelect(ticketId)}>
            {isRelaxedTemplate && isTablet && (
                <AgentImage
                    src={displayPicture}
                    alt={firstName}
                    width='36px'
                    height='36px'
                />
            )}
            <div className='ticket__details'>
                <div className='d-flex align-items-center w-100'>
                    {isWorkModeTemplate || !isTablet ? (
                        <TicketStatus
                            ticketPhase={ticketPhase}
                            ticketId={ticketId}
                        />
                    ) : (
                        isRelaxedTemplate &&
                        isTablet && (
                            <span>I think I might have an issue...</span>
                        )
                    )}

                    {!isTablet && (
                        <div className='close__ticket' onClick={closeTicket}>
                            <ReactSVG
                                src={imageLinks?.svg?.crossIconGrey}
                                className='d-inline-flex'
                            />
                        </div>
                    )}
                </div>
                <h6 className='agent__name'>{`${firstName} ${lastName}`}</h6>
            </div>
        </div>
    );
};

export default Ticket;
