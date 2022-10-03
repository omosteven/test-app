import React from "react";
import LiveChat from "./LiveChat/LiveChat";

const ChatModule = ({
    ticket,
    getCustomerTickets,
    showVerifyForm,
    handleVerifyAction,
    handleCloseTicket,
    handleTicketCloseSuccess
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
                    handleTicketCloseSuccess
                }}
            />
        </>
    );
};

export default React.memo(ChatModule);
