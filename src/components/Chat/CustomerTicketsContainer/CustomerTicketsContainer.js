import React, { useEffect } from "react";
import { dataQueryStatus } from "../../../utils/formatHandlers";
import ErrorView from "../../common/ErrorView/ErrorView";
import NewTicketButton from "./CustomerTickets/common/NewTicketButton/NewTicketButton";
import CustomerTickets from "./CustomerTickets/CustomerTickets";
import CustomerTicketsSkeleton from "./CustomerTicketsSkeleton/CustomerTicketsSkeleton";
import { useWindowSize } from "../../../utils/hooks";

const { LOADING, NULLMODE, DATAMODE, ERROR } = dataQueryStatus;

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
    const { width } = useWindowSize();

    const tablet = width > 425;

    useEffect(() => {
        if (tablet) {
            toggleChatMenu(false);
        }
    }, [tablet]);

    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return <CustomerTicketsSkeleton />;

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