import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SocketContext } from '../../../../../../lib/socket/context/socket';
import { SUBSCRIBE_TO_TICKET, TICKET_PHASE_CHANGE } from '../../../../../../lib/socket/events';
import { setActiveTicket } from '../../../../../../store/tickets/actions';
import { ticketsPhases } from './enum';

const TicketStatus = ({ticketPhase, ticketId }) => {
    const dispatch = useDispatch();

    const [setPhase, updatePhase] = useState(ticketPhase);

    const currentPhase = ticketsPhases[setPhase];
    const socket = useContext(SocketContext);

    const handleNewPhase = (data) => {
        console.log("Ticket Phase has changed")
        console.log(data);
        dispatch(setActiveTicket(data))
        updatePhase(data?.ticketPhase)
    }

    useEffect(() => {
        socket.emit(SUBSCRIBE_TO_TICKET, { ticketId });
        socket.on(TICKET_PHASE_CHANGE, handleNewPhase)
        return () => {
            socket.off(TICKET_PHASE_CHANGE);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='ticket__status'>
            <div className="status__circle" style={{ background: currentPhase?.fillColor }}></div>
            <span>{currentPhase?.title} </span>
        </div>
    );
};

export default TicketStatus;