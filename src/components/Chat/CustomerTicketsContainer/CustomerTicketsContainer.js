import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { dataQueryStatus } from "../../../utils/formatHandlers";
import ErrorView from "../../common/ErrorView/ErrorView";
import NewTicketButton from "./CustomerTickets/common/NewTicketButton/NewTicketButton";
import CustomerTickets from "./CustomerTickets/CustomerTickets";
import CustomerTicketsSkeleton from "./CustomerTicketsSkeleton/CustomerTicketsSkeleton";
import { useWindowSize } from "../../../utils/hooks";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { DotLoader } from "components/ui";
import "./CustomerTicketsContainer.scss";

const { LOADING, NULLMODE, DATAMODE, ERROR } = dataQueryStatus;
const { RELAXED } = defaultTemplates;

const CustomerTicketsContainer = ({
    status,
    errorMssg,
    customerTickets,
    selectedTicket,
    handleTicketSelect,
    createNewTicket,
    getCustomerTickets,
    closeTicket,
    showChatMenu,
    toggleChatMenu,
}) => {
    const { defaultTemplate } = useSelector((state) => state.chat.chatSettings);
    const { width } = useWindowSize();

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isNotTablet = width > 768;
    const isTablet = width <= 768;

    useEffect(() => {
        if (isNotTablet) {
            toggleChatMenu?.(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNotTablet]);

    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <>
                        {isRelaxedTemplate && isTablet ? (
                            <div className="relaxed__customer__ticket__loader">
                            <DotLoader />
                            </div>
                        ) : (
                            <CustomerTicketsSkeleton />
                        )}
                    </>
                );

            case NULLMODE:
                return (
                    <>
                        <NewTicketButton
                            handleClick={createNewTicket}
                            otherClassNames={showChatMenu ? "mt-5 large" : ""}
                        />
                    </>
                );

            case DATAMODE:
                return (
                    <>
                        <CustomerTickets
                            tickets={customerTickets}
                            handleTicketSelect={handleTicketSelect}
                            selectedTicket={selectedTicket}
                            closeTicket={closeTicket}
                            showChatMenu={showChatMenu}
                            getCustomerTickets={getCustomerTickets}
                        />
                        <NewTicketButton
                            handleClick={createNewTicket}
                            otherClassNames={showChatMenu ? "large" : ""}
                        />
                    </>
                );

            case ERROR:
                return (
                    <ErrorView retry={getCustomerTickets} message={errorMssg} />
                );

            default:
                return "";
        }
    };

    return (
        <div
            id={"authTickets"}
            className={showChatMenu ? "show-mobile-menu" : ""}>
            {renderBasedOnStatus()}
        </div>
    );
};

export default CustomerTicketsContainer;
