import { useSelector } from "react-redux";
import CustomerTicketsContainer from "../../CustomerTicketsContainer/CustomerTicketsContainer";
import ChatSettingsToggler from "./ChatSettingsToggler/ChatSettingsToggler";
import ChatToggler from "./ChatToggler/ChatToggler";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";
import ErrorView from "components/common/ErrorView/ErrorView";
import { dataQueryStatus } from "utils/formatHandlers";
import CompanyChatLogo from "./CompanyChatLogo/CompanyChatLogo";
import "./ChatHeader.scss";

const { RELAXED, WORK_MODE } = defaultTemplates;
const { LOADING, NULLMODE, DATAMODE, ERROR } = dataQueryStatus;

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
    isAuthPage,
}) => {
    const {
        chatSettings: { companyLogo, teamName, defaultTemplate },
    } = useSelector((state) => state.chat);
    const {
        activeTicket: { agent, ticketId },
    } = useSelector((state) => state.tickets);

    const { width } = useWindowSize();

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORK_MODE;
    const isTablet = width <= 768;
    const isNotTablet = width > 768;

    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <CompanyChatLogo
                        src={companyLogo}
                        alt={teamName}
                        className='company__logo'
                        name={teamName}
                    />
                );
            case DATAMODE:
            case NULLMODE:
                return (
                    <>
                        {isRelaxedTemplate && isTablet && (
                            <>
                                {agent && !showChatMenu ? (
                                    <>
                                        <CompanyChatLogo
                                            src={companyLogo}
                                            alt={teamName}
                                            className='company__logo'
                                            name={`${agent?.firstName} ${agent?.lastName}`}
                                        />
                                    </>
                                ) : (
                                    <CompanyChatLogo
                                        src={companyLogo}
                                        alt={teamName}
                                        className='company__logo'
                                        name={teamName}
                                    />
                                )}
                            </>
                        )}
                    </>
                );

            case ERROR:
                return (
                    <ErrorView retry={getCustomerTickets} message={errorMssg} />
                );

            default:
                return (
                    <CompanyChatLogo
                        src={companyLogo}
                        alt={teamName}
                        className='company__logo'
                        name={teamName}
                    />
                );
        }
    };

    return (
        <div
            id='header__wrapper'
            className={`${!showActions ? "high__index" : ""}`}>
            <header
                id={`header`}
                className={`${isAuthPage ? "header__auth" : ""}`}>
                <div
                    className={`chat__header ${
                        !isAuthPage
                            ? "chat__header__user"
                            : "chat__header__auth"
                    }`}>
                    {showActions && isTablet && (
                        <ChatToggler
                            onClick={() =>
                                toggleChatMenu?.((prevState) => !prevState)
                            }
                        />
                    )}

                    <div className='logo'>
                        {isWorkModeTemplate || isNotTablet ? (
                            <CompanyChatLogo
                                src={companyLogo}
                                alt={teamName}
                                className='company__logo'
                                name={isAuthPage ? teamName : ""}
                            />
                        ) : (
                            isTablet && renderBasedOnStatus()
                        )}
                    </div>

                    {!showVerifyForm && (
                        <>
                            <CustomerTicketsContainer
                                closeTicket={handleTicketModalAction}
                                handleTicketSelect={(data) => {
                                    handleTicketSelect(data);
                                    toggleChatMenu?.(false);
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
                                <div
                                    className={`show-only-on-mobile ${
                                        isNotTablet ? "show-on-desktop" : ""
                                    }`}>
                                    <ChatSettingsToggler
                                        isMobile={true}
                                        handleCloseTicket={handleCloseTicket}
                                        canCloseTicket={ticketId !== undefined}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </header>
        </div>
    );
};

export default ChatHeader;
