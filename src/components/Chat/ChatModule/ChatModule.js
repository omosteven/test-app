import React from "react";
import LiveChat from "./LiveChat/LiveChat";

const ChatModule = ({
    ticket,
    getCustomerTickets,
    showVerifyForm,
    handleVerifyAction,
    handleCloseTicket,
    handleTicketCloseSuccess,
    handleOpenNewTicket,
    reconnectUser,
    verifyUserAction
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
                    handleOpenNewTicket,
                    reconnectUser,
                    verifyUserAction
                }}
            />
        </>
    );
};

export default React.memo(ChatModule);
