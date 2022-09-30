import React from "react";
import LiveChat from "./LiveChat/LiveChat";

const ChatModule = ({
    ticket,
    getCustomerTickets,
    showVerifyForm,
    handleVerifyAction,
    handleCloseTicket
}) => {
    return (
        <>
            <LiveChat
                {...{
                    ticket,
                    getCustomerTickets,
                    showVerifyForm,
                    handleVerifyAction,
                    handleCloseTicket
                }}
            />
        </>
    );
};

export default React.memo(ChatModule);
