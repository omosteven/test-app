import React from "react";
import LiveChat from "./LiveChat/LiveChat";

const ChatModule = ({
    ticket,
    getCustomerTickets,
    showVerifyForm,
    handleVerifyAction,
    handleCloseTicket,
    handleTicketCloseSuccess,
    handleOpenNewTicket
}) => {
    return (
        <>
            <LiveChat
                {...{
                    ticket,
                    getCustomerTickets,
                    showVerifyForm,
                    handleVerifyAction,
                    handleCloseTicket,
                    handleTicketCloseSuccess,
                    handleOpenNewTicket
                }}
            />
        </>
    );
};

export default React.memo(ChatModule);
