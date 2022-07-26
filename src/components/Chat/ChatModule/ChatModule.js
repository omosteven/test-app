import React from "react";
import LiveChat from "./LiveChat/LiveChat";

const ChatModule = ({ ticket, getCustomerTickets }) => {
   
    return (
        <>
            <LiveChat
                {
                ...{
                    ticket,
                    getCustomerTickets
                }
                }
            />
        </>
    );
};


export default React.memo(ChatModule);
