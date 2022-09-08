import React from "react";
import { SmothScrollContentHorizontal } from "../../../ui/SmothScrollContent/SmothScrollContent";
import Ticket from "./Ticket/Ticket";
import "./CustomerTickets.scss";

const CustomerTickets = ({
    tickets,
    selectedTicket,
    handleTicketSelect,
    closeTicket,
    showChatMenu,
    getCustomerTickets
}) => {
    return (
        <SmothScrollContentHorizontal
            ID={"tickets-list"}
            activeElement={selectedTicket?.ticketId}
            className={`customer__tickets--container`}
            selector={"#tickets-list"}
            extraProps={{
                axis: showChatMenu ? "y" : "x",
            }}>
            <>
                {tickets.map((item, index) => {
                    return (
                        <Ticket
                            key={index}
                            data={item}
                            handleTicketSelect={() => handleTicketSelect(item)}
                            isActive={
                                selectedTicket?.ticketId === item?.ticketId
                            }
                            closeTicket={closeTicket}
                            getCustomerTickets={getCustomerTickets}
                        />
                    );
                })}
            </>
        </SmothScrollContentHorizontal>
    );
};

export default CustomerTickets;
