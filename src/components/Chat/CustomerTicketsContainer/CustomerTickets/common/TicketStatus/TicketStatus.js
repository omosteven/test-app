import React, { useContext, useEffect, useState } from "react";
// import { useDispatch } from 'react-redux';
import { SocketContext } from "../../../../../../lib/socket/context/socket";
import { TICKET_PHASE_CHANGE } from "../../../../../../lib/socket/events";
// import { setActiveTicket } from '../../../../../../store/tickets/actions';
import { ticketsPhases } from "./enum";
import "./TicketStatus.scss";

const TicketStatus = ({ ticketPhase, ticketId }) => {
    // const dispatch = useDispatch();

    const [setPhase, updatePhase] = useState(ticketPhase);

    const currentPhase = ticketsPhases[setPhase];
    const socket = useContext(SocketContext);

    const handleNewPhase = (data) => {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        if (parsedData?.ticketId === ticketId) {
            updatePhase(parsedData?.ticketPhase);
        }
        // dispatch(setActiveTicket(data))
    };

    useEffect(() => {
        socket.on(TICKET_PHASE_CHANGE, handleNewPhase);

        return () => {
            socket.off(TICKET_PHASE_CHANGE);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='ticket__status'>
            <div
                className='status__circle'
                style={{ background: currentPhase?.fillColor }}></div>
            <span>{currentPhase?.title} </span>
        </div>
    );
};

export default TicketStatus;
