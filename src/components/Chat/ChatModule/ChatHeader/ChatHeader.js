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
import SaveChatButton from "./SaveChatButton/SaveChatButton";
import { validateEmail } from "utils/helper";

const { RELAXED, WORKMODE } = defaultTemplates;
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
    handleVerifyAction,
    alignLeft,
}) => {
    const {
        chatSettings: { companyLogo, teamName, defaultTemplate },
    } = useSelector((state) => state.chat);
    const {
        activeTicket: { agent, ticketId },
    } = useSelector((state) => state.tickets);

    const { user } = useSelector((state) => state?.auth);

    const { email } = user || {};

    const { width } = useWindowSize();

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORKMODE;
    const isTablet = width <= 768;
    const isNotTablet = width > 768;

    const canSaveConvo = !validateEmail(email) && ticketId;

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
                    {showActions && isTablet && !canSaveConvo && (
                        <ChatToggler
                            onClick={() =>
                                toggleChatMenu?.((prevState) => !prevState)
                            }
                        />
                    )}

                    <div
                        className={`logo ${
                            alignLeft || canSaveConvo
                                ? "chat__header-save-convo"
                                : ""
                        }`}>
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
                                canSaveConvo={canSaveConvo}
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

                            {showActions && !canSaveConvo && (
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

                    {canSaveConvo && (
                        <SaveChatButton
                            handleVerifyAction={handleVerifyAction}
                            showVerifyForm={showVerifyForm}
                        />
                    )}
                </div>
            </header>
        </div>
    );
};

export default ChatHeader;
