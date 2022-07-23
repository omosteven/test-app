import React from "react";
import ClientSideOnlyRenderer from "../../common/ClientSideOnlyRenderer/ClientSideOnlyRenderer";
import LiveChat from "./LiveChat/LiveChat";

const ChatModule = ({ ticket, getCustomerTickets, isServer }) => {
    const renderDone = () => {
        return (
            <>
                <LiveChat
                    {
                    ...{
                        ticket,
                        getCustomerTickets
                    }
                    }
                />
            </>
        );
    }
    const renderLoading = () => {
        return (<div>Loading...</div>);
    }

    return (
        <>
            <ClientSideOnlyRenderer
                initialSsrDone={!isServer}
                renderDone={renderDone}
                renderLoading={renderLoading}
            />
        </>
    );
};

ChatModule.getInitialProps = ({ req }) => {
    console.log(!!req)
    console.log("Request available/not")
    return {
        isServer: !!req,
    };
};

export default React.memo(ChatModule);
