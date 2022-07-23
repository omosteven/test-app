import { useState } from "react";
import { useSelector } from "react-redux";
import CustomerTicketsContainer from "../../CustomerTicketsContainer/CustomerTicketsContainer";
import ChatSettingsToggler from "./ChatSettingsToggler/ChatSettingsToggler";
import ChatToggler from "./ChatToggler/ChatToggler";


const ChatHeader = ({ status,
    errorMssg,
    handleTicketSelect,
    customerTickets,
    selectedTicket,
    createNewTicket,
    getCustomerTickets,
    handleTicketModalAction
}) => {
    const [showChatMenu, toggleChatMenu] = useState(false)
    const { chatSettings: { companyLogo } } = useSelector(state => state.chat)

    return (
        <header id='header'>
            <div className="chat__header">
                <ChatToggler 
                    onClick={() => toggleChatMenu((prevState) => !prevState)} 
                    />
                <div className="logo">
                    <img src={companyLogo} layout='fill' />
                </div>

                <CustomerTicketsContainer
                    closeTicket={handleTicketModalAction}
                    handleTicketSelect={(data) =>{
                        handleTicketSelect(data)
                        toggleChatMenu(false)
                    }}
                    {
                    ...{
                        status,
                        errorMssg,
                        customerTickets,
                        selectedTicket,
                        createNewTicket,
                        getCustomerTickets,
                        showChatMenu
                    }
                    }
                />
                <ChatSettingsToggler />
            </div>
        </header>
    );
};

export default ChatHeader;
