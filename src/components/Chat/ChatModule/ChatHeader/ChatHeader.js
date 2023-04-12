import { useSelector } from "react-redux";
import CustomerTicketsContainer from "../../CustomerTicketsContainer/CustomerTicketsContainer";
import ChatSettingsToggler from "./ChatSettingsToggler/ChatSettingsToggler";
import ChatToggler from "./ChatToggler/ChatToggler";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";
import ErrorView from "components/common/ErrorView/ErrorView";
import { dataQueryStatus } from "utils/formatHandlers";
import CompanyChatLogo from "./CompanyChatLogo/CompanyChatLogo";
import CloseVerifyForm from "./CloseVerifyForm/CloseVerifyForm";
import { validateEmail } from "utils/helper";
import ChatHeaderBannerMessage from "./ChatHeaderBannerMessage/ChatHeaderBannerMessage";
import "./ChatHeader.scss";

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
        <>
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
                        {showVerifyForm && (
                            <CloseVerifyForm
                                handleVerifyAction={handleVerifyAction}
                            />
                        )}

                        <div
                            className={`logo
                         ${alignLeft ? "logo__left__aligned" : ""}`}>
                            {isWorkModeTemplate || isNotTablet ? (
                                <CompanyChatLogo
                                    src={companyLogo}
                                    alt={teamName}
                                    className='company__logo'
                                    name={
                                        isAuthPage || showVerifyForm
                                            ? teamName
                                            : ""
                                    }
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

                                {showActions && (
                                    <div
                                        className={`show-only-on-mobile ${
                                            isNotTablet ? "show-on-desktop" : ""
                                        }`}>
                                        <ChatSettingsToggler
                                            isMobile={true}
                                            handleCloseTicket={
                                                handleCloseTicket
                                            }
                                            canCloseTicket={
                                                ticketId !== undefined
                                            }
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        {showVerifyForm && (
                            <ChatSettingsToggler
                                isMobile={true}
                                handleCloseTicket={handleCloseTicket}
                                canCloseTicket={ticketId !== undefined}
                            />
                        )}
                    </div>
                </header>
            </div>
            {isRelaxedTemplate &&
                !validateEmail(email) &&
                isTablet &&
                status === DATAMODE && (
                    <ChatHeaderBannerMessage
                        handleVerifyAction={handleVerifyAction}
                        clickAction={!showVerifyForm}
                        closeAction={showVerifyForm}
                        message={
                            showVerifyForm ? (
                                `  We will never ask you for your PIN or
                password`
                            ) : (
                                <>
                                    To save your ticket, click{" "}
                                    <span className='highlight underline'>
                                        here
                                    </span>{" "}
                                    to confirm your email.
                                </>
                            )
                        }
                    />
                )}
        </>
    );
};

export default ChatHeader;
