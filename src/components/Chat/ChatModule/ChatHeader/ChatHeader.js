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
}) => {
    const {
        chatSettings: {
            companyLogo,
            workspaceSlug,
            defaultTemplate,
            emailLogoUrl,
        },
    } = useSelector((state) => state.chat);
    const {
        activeTicket: { agent },
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
                        src={emailLogoUrl}
                        alt={workspaceSlug}
                        className='workspace__email__logo'
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
                                            alt={workspaceSlug}
                                            className='company__logo'
                                        />{" "}
                                        <span className='workspace__agent__name'>
                                            {agent?.firstName} {agent?.lastName}
                                        </span>
                                    </>
                                ) : (
                                    <CompanyChatLogo
                                        src={emailLogoUrl}
                                        alt={workspaceSlug}
                                        className='workspace__email__logo'
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
                    src={emailLogoUrl}
                    alt={workspaceSlug}
                    className='workspace__email__logo'
                />
                );
        }
    };
console.log(agent && !showChatMenu,emailLogoUrl)
    return (
        <div id='header__wrapper'>
            <header id='header'>
                <div className='chat__header'>
                    {showActions && (
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
                                alt={workspaceSlug}
                                className='company__logo'
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
