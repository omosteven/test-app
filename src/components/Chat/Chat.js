import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../lib/api";
import apiRoutes from "../../lib/api/apiRoutes";
import { onMessageListener } from "../../lib/firebase/firebase";
import { socket, SocketContext } from "../../lib/socket/context/socket";
import { retriveAccessToken } from "../../storage/sessionStorage";
import { setActiveTicket } from "../../store/tickets/actions";
import { dataQueryStatus } from "../../utils/formatHandlers";
import { getErrorMessage, validateEmail } from "../../utils/helper";
import Empty from "../common/Empty/Empty";
import { ToastContext } from "../common/Toast/context/ToastContextProvider";

import queryString from "query-string";

import ChatHeader from "./ChatModule/ChatHeader/ChatHeader";
import ChatModule from "./ChatModule/ChatModule";
import ChatToastNotification from "./ChatToastNotification/ChatToastNotification";
import ConfirmCloseChatModal from "./ConfirmCloseChatModal/ConfirmCloseChatModal";
import NewTicketButton from "./CustomerTicketsContainer/CustomerTickets/common/NewTicketButton/NewTicketButton";
import "./Chat.scss";
import { pushAuthUser } from "store/auth/actions";

const { ERROR, LOADING, DATAMODE, NULLMODE } = dataQueryStatus;

const Chat = () => {
    const [showTictketActionModal, toggleTicketActionModal] = useState();
    const [status, setStatus] = useState("");
    const [errorMssg, setErrorMssg] = useState("");
    const dispatch = useDispatch();

    const toastMessage = useContext(ToastContext);

    const { activeTicket } = useSelector((state) => state.tickets);

    const {
        chatSettings: { workspaceSlug },
    } = useSelector((state) => state.chat);

    const selectedTicket = activeTicket;
    const [customerTickets, setCustomerTickets] = useState([]);

    const [showVerifyForm, setShowVerifyForm] = useState(false);

    let params = queryString.parse(window.location.search);

    const isAuthCodeAvailable = params?.code ? true : false;

    // const [selectedTicket, setSelectedTicket] = useState();

    const [customerTicketId, setCustomerTicketId] = useState();

    const getCustomerAuthToken = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();

            const tickedId = params?.ticketId;
            const tempCode = params?.code;

            const res = await API.get(
                apiRoutes.getAuthToken(tempCode, tickedId)
            );

            if (res.status === 200) {
                setCustomerTicketId(tickedId);
                await sessionStorage.setItem(
                    "accessToken",
                    res.data.data.token
                );
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const redirectCustomer = async (customer) => {
        if (!validateEmail(customer?.email)) {
            await sessionStorage.clear();
            window.location.href = `/chat?workspaceSlug=${workspaceSlug}`;
        }
    };

    const getCustomerTickets = async (ticketId, openNewTicket = true) => {
        try {
            dispatch(setActiveTicket(null));

            setStatus(LOADING);
            setErrorMssg();

            const res = await API.get(apiRoutes.userTickets);
            if (res.status === 200) {
                const tickets = res.data.data;
                if (tickets.length > 0) {
                    setCustomerTickets(tickets);
                    const { ticketId: prevSelectedId } = activeTicket || {};
                    const newTicket = ticketId
                        ? tickets?.find((x) => x.ticketId === ticketId)
                        : prevSelectedId
                        ? tickets?.find((x) => x.ticketId === prevSelectedId)
                        : tickets[0];
                    dispatch(
                        setActiveTicket({
                            ...newTicket,
                            activeConvoSuggestion: false,
                        })
                    );

                    if (
                        (newTicket === undefined || newTicket === null) &&
                        customerTicketId !== undefined
                    ) {
                        return redirectCustomer(newTicket?.customer);
                    }

                    dispatch(pushAuthUser(newTicket?.customer));

                    setStatus(DATAMODE);
                } else {
                    openNewTicket ? createNewTicket() : setStatus(NULLMODE);
                }
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleTicketModalAction = () => {
        toggleTicketActionModal(true);
    };

    const handleTicketCloseSuccess = () => {
        dispatch(setActiveTicket());
        getCustomerTickets(null, false);
        toggleTicketActionModal(false);
    };

    const createNewTicket = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.createTicket;
            const res = await API.post(url, {
                userToken: retriveAccessToken(),
            });
            if (res.status === 201) {
                const { ticketId } = res.data.data;
                getCustomerTickets(ticketId);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleTicketSelect = (ticket) => {
        dispatch(setActiveTicket(ticket));
    };

    const toastNotification = ({ title, body }) => {
        toastMessage(<ChatToastNotification {...{ title, body }} />);
    };

    onMessageListener().then((payload) => {
        const { notification } = payload;
        toastNotification(notification);
    });

    const handleVerifyAction = () => {
        setShowVerifyForm(!showVerifyForm);
    };

    const callHandler = () => {
        isAuthCodeAvailable
            ? customerTicketId
                ? getCustomerTickets(customerTicketId)
                : getCustomerAuthToken()
            : getCustomerTickets();
    };

    useEffect(() => {
        callHandler();
    }, [customerTicketId]);

    return (
        <>
            <SocketContext.Provider value={socket}>
                <div className='row justify-content-center h-100'>
                    <div className='col-md-10 col-12'>
                        <div className='chat__container'>
                            <ChatHeader
                                {...{
                                    status,
                                    errorMssg,
                                    handleTicketSelect,
                                    customerTickets,
                                    selectedTicket,
                                    createNewTicket,
                                    getCustomerTickets,
                                    handleTicketModalAction,
                                    showVerifyForm,
                                }}
                            />
                            {selectedTicket?.ticketId ? (
                                <ChatModule
                                    key={selectedTicket?.ticketId}
                                    ticket={selectedTicket}
                                    getCustomerTickets={getCustomerTickets}
                                    showVerifyForm={showVerifyForm}
                                    handleVerifyAction={handleVerifyAction}
                                />
                            ) : (
                                <div className='empty__chat--interface'>
                                    <div className='empty__group'>
                                        <Empty
                                            message={`No conversation opened yet, click on any conversation on the sidebar \n to continue or start a new conversation`}
                                        />
                                        <div className='d-sm-none w-100'>
                                            <div className='row justify-content-center'>
                                                <div className='col-md-10'>
                                                    <NewTicketButton
                                                        handleClick={
                                                            createNewTicket
                                                        }
                                                        otherClassNames={
                                                            "large"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {showTictketActionModal && (
                    <ConfirmCloseChatModal
                        show={showTictketActionModal}
                        toggle={() => toggleTicketActionModal(false)}
                        referenceData={selectedTicket}
                        handleSuccess={handleTicketCloseSuccess}
                    />
                )}
            </SocketContext.Provider>
        </>
    );
};

export default Chat;
