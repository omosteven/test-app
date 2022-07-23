import React from "react";
import { dataQueryStatus } from "../../../utils/formatHandlers";
import ErrorView from "../../common/ErrorView/ErrorView";
import NewTicketButton from "./CustomerTickets/common/NewTicketButton/NewTicketButton";
import CustomerTickets from "./CustomerTickets/CustomerTickets";
import CustomerTicketsSkeleton from "./CustomerTicketsSkeleton/CustomerTicketsSkeleton";

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
    showChatMenu
}) => {
    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return <CustomerTicketsSkeleton />;

            case NULLMODE:
                return (
                    <>
                        <NewTicketButton handleClick={createNewTicket} otherClassNames={ showChatMenu ? "mt-5 large" : ""} />
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
                        <NewTicketButton handleClick={createNewTicket} otherClassNames={ showChatMenu ? "large" : "" }/>
                    </>
                );

            case ERROR:
                return <ErrorView retry={getCustomerTickets} message={errorMssg} />;

            default:
                return "";
        }
    };

    return (
        <div id={'authTickets'} className={showChatMenu ? 'show-mobile-menu' : ''}>
            {renderBasedOnStatus()}
        </div>
    );
};

export default CustomerTicketsContainer;
