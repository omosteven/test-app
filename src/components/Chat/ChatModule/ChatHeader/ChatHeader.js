import { useSelector } from "react-redux";
import CustomerTicketsContainer from "../../CustomerTicketsContainer/CustomerTicketsContainer";
import ChatSettingsToggler from "./ChatSettingsToggler/ChatSettingsToggler";
import ChatToggler from "./ChatToggler/ChatToggler";
import "./ChatHeader.scss";

const ChatHeader = ({
    status,
    errorMssg,
    handleTicketSelect,
    customerTickets,
    selectedTicket,
    createNewTicket,
    getCustomerTickets,
    handleTicketModalAction,
    showVerifyForm,
    handleCloseTicket,
    showChatMenu,
    toggleChatMenu,
}) => {
    const {
        chatSettings: { companyLogo },
    } = useSelector((state) => state.chat);

    return (
        <header id='header'>
            <div className='chat__header'>
                {!showChatMenu && (
                    <ChatToggler
                        onClick={() =>
                            toggleChatMenu((prevState) => !prevState)
                        }
                    />
                )}

                <div className='logo'>
                    <img src={companyLogo} alt='Metacare' layout='fill' />
                </div>

                {!showVerifyForm && (
                    <>
                        <CustomerTicketsContainer
                            closeTicket={handleTicketModalAction}
                            handleTicketSelect={(data) => {
                                handleTicketSelect(data);
                                toggleChatMenu(false);
                            }}
                            {...{
                                status,
                                errorMssg,
                                customerTickets,
                                selectedTicket,
                                createNewTicket,
                                getCustomerTickets,
                                showChatMenu,
                                toggleChatMenu,
                            }}
                        />

                        {!showChatMenu && (
                            <div className='show-only-on-mobile'>
                                <ChatSettingsToggler
                                    isMobile={true}
                                    handleCloseTicket={handleCloseTicket}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
};

export default ChatHeader;
