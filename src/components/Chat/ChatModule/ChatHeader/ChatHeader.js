import { useSelector } from "react-redux";
import CustomerTicketsContainer from "../../CustomerTicketsContainer/CustomerTicketsContainer";
import ChatSettingsToggler from "./ChatSettingsToggler/ChatSettingsToggler";
import ChatToggler from "./ChatToggler/ChatToggler";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";
import "./ChatHeader.scss";

const { RELAXED } = defaultTemplates;

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
    showActions,
}) => {
    const {
        chatSettings: { companyLogo, workspaceSlug, defaultTemplate },
    } = useSelector((state) => state.chat);
    const {
        activeTicket: { agent },
    } = useSelector((state) => state.tickets);

    const { width } = useWindowSize();

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isTablet = width <= 768;

    return (
        <header id='header'>
            <div className='chat__header'>
                {showActions && (
                    <ChatToggler
                        onClick={() =>
                            toggleChatMenu((prevState) => !prevState)
                        }
                    />
                )}

                <div className='logo'>
                    <img src={companyLogo} alt={workspaceSlug} layout='fill' />{" "}
                    {isRelaxedTemplate && isTablet && (
                        <span className='workspace__agent__name'>
                            {agent
                                ? `${agent?.firstName} ${agent?.lastName}`
                                : workspaceSlug}
                        </span>
                    )}
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

                        {showActions && (
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
