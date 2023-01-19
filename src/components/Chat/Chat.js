import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../lib/api";
import apiRoutes from "../../lib/api/apiRoutes";
import { onMessageListener } from "../../lib/firebase/firebase";
import {
    reconnectSocket,
    socket,
    SocketContext,
} from "../../lib/socket/context/socket";
import { retriveAccessToken } from "../../storage/sessionStorage";
import { setActiveTicket } from "../../store/tickets/actions";
import { dataQueryStatus } from "../../utils/formatHandlers";
import { getErrorMessage } from "../../utils/helper";
import Empty from "../common/Empty/Empty";
import { ToastContext } from "../common/Toast/context/ToastContextProvider";
import queryString from "query-string";
import ChatHeader from "./ChatModule/ChatHeader/ChatHeader";
import ChatModule from "./ChatModule/ChatModule";
import ChatToastNotification from "./ChatToastNotification/ChatToastNotification";
import NewTicketButton from "./CustomerTicketsContainer/CustomerTickets/common/NewTicketButton/NewTicketButton";
import { pushAuthUser } from "store/auth/actions";
import TicketCloseModal from "./TicketCloseModal/TicketCloseModal";
import { setConversationBreakers } from "store/chat/actions";
import { defaultTemplates, defaultThemes } from "hoc/AppTemplateWrapper/enum";
import { DotLoader } from "components/ui";
import PoweredBy from "components/common/PoweredBy/PoweredBy";
import { useWindowSize } from "utils/hooks";
import "./Chat.scss";

const { ERROR, LOADING, DATAMODE, NULLMODE } = dataQueryStatus;
const { RELAXED, WORK_MODE } = defaultTemplates;
const { DARK_MODE_DEFAULT } = defaultThemes;

const Chat = () => {
    const [showChatMenu, toggleChatMenu] = useState(false);
    const [showTictketActionModal, toggleTicketActionModal] = useState();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMssg, setErrorMssg] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();
    const { width } = useWindowSize();

    const toastMessage = useContext(ToastContext);

    const { activeTicket } = useSelector((state) => state.tickets);

    const selectedTicket = activeTicket;
    const [customerTickets, setCustomerTickets] = useState([]);

    const [showVerifyForm, setShowVerifyForm] = useState(false);

    const [socketConnection, setSocketConnection] = useState(socket);

    let params = queryString.parse(window.location.search);

    const isAuthCodeAvailable = params?.code ? true : false;

    const isAuthTokenAvailable = params?.token ? true : false;

    const userToken = retriveAccessToken();
    // const [selectedTicket, setSelectedTicket] = useState();

    const [customerTicketId, setCustomerTicketId] = useState();
    const { defaultTemplate, defaultTheme } = useSelector(
        (state) => state.chat.chatSettings
    );

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORK_MODE;
    const isDarkModeTheme = defaultTheme === DARK_MODE_DEFAULT;
    const isTablet = width <= 768;

    const fetchConvoBreakers = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.getActionBranches;
            const res = await API.get(url);
            if (res.status === 200) {
                const { data } = res.data;
                dispatch(setConversationBreakers(data));
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const loginWithEmailLink = async () => {
        const tickedId = params?.ticketId;
        const authToken = params?.token;
        setCustomerTicketId(tickedId);
        await sessionStorage.setItem("accessToken", authToken);
    };

    const getCustomerAuthToken = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();

            const tickedId = params?.ticketId;
            const authCode = params?.code;

            const res = await API.get(
                apiRoutes.getAuthToken(authCode, tickedId)
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
            window.stop();
        }
    };

    const getCustomerTickets = async (
        ticketId,
        openNewTicket = true,
        openChatMenu = false
    ) => {
        try {
            dispatch(setActiveTicket(null));

            setStatus(LOADING);
            setErrorMssg();
            setLoading(true);

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

                    const { customer } = newTicket || {};
                    if (customer) {
                        dispatch(pushAuthUser(customer));
                    }

                    setStatus(DATAMODE);
                    toggleChatMenu(openChatMenu ? true : false);
                } else {
                    openNewTicket ? createNewTicket() : setStatus(NULLMODE);
                }

                setLoading(false);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
            setLoading(false);
            window.stop();
        }
    };

    const handleTicketModalAction = () => {
        toggleTicketActionModal(true);
    };

    const handleTicketCloseSuccess = () => {
        dispatch(setActiveTicket());

        getCustomerTickets(null, false, isTablet ? true : false);
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
        isAuthTokenAvailable
            ? !customerTicketId
                ? loginWithEmailLink()
                : getCustomerTickets(customerTicketId)
            : isAuthCodeAvailable
            ? customerTicketId
                ? getCustomerTickets(customerTicketId)
                : getCustomerAuthToken()
            : getCustomerTickets();

        isAuthCodeAvailable
            ? customerTicketId && fetchConvoBreakers()
            : fetchConvoBreakers();
    };

    useEffect(() => {
        callHandler();
    }, [customerTicketId]);

    const handleCloseTicket = () => {
        toggleTicketActionModal(true);
    };

    // useEffect(() => {
    //     if (
    //         (isAuthCodeAvailable || isAuthTokenAvailable) &&
    //         params?.connectionStatus !== "connected"
    //     ) {
    //         isAuthCodeAvailable
    //             ? history.push(
    //                   `/direct?workspaceSlug=${params?.workspaceSlug}&ticketId=${params?.ticketId}&code=${params?.code}&connectionStatus=connected`
    //               )
    //             : history.push(
    //                   `/chat?workspaceSlug=${params?.workspaceSlug}&ticketId=${params?.ticketId}&token=${params?.token}&connectionStatus=connected`
    //               );
    //         setTimeout(() => {
    //             window.location.reload();
    //         }, 1000);
    //     }
    // }, []);

    useEffect(() => {
        if (userToken) {
            const socketReconnection = reconnectSocket(userToken);
            setSocketConnection(socketReconnection);
        }
    }, [socket, userToken]);

    return (
        <>
            <SocketContext.Provider value={socketConnection}>
                <div
                    className={`row justify-content-center h-100 ${
                        isDarkModeTheme ? "dark__desktop" : ""
                    }`}>
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
                                    handleCloseTicket,
                                    showChatMenu,
                                    toggleChatMenu,
                                }}
                                showActions={
                                    loading || showVerifyForm
                                        ? false
                                        : !showChatMenu
                                        ? true
                                        : selectedTicket?.ticketId === undefined
                                        ? true
                                        : false
                                }
                            />
                            {selectedTicket?.ticketId ? (
                                <ChatModule
                                    key={selectedTicket?.ticketId}
                                    ticket={selectedTicket}
                                    getCustomerTickets={getCustomerTickets}
                                    showVerifyForm={showVerifyForm}
                                    handleVerifyAction={handleVerifyAction}
                                    handleCloseTicket={handleCloseTicket}
                                    handleTicketCloseSuccess={
                                        handleTicketCloseSuccess
                                    }
                                    handleOpenNewTicket={createNewTicket}
                                />
                            ) : (
                                <div className='empty__chat--interface'>
                                    <div className='empty__group'>
                                        {loading && isRelaxedTemplate ? (
                                            <>
                                                <DotLoader />
                                                <p className='preparing__tickets'>
                                                    Preparing your tickets
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Empty
                                                    message={
                                                        loading
                                                            ? `Please wait while we are retrieving your conversations`
                                                            : `No conversation opened yet.`
                                                    }
                                                />
                                                <div className='d-md-none w-100'>
                                                    <div className='row justify-content-center'>
                                                        <div className='col-md-10'>
                                                            <NewTicketButton
                                                                handleClick={
                                                                    createNewTicket
                                                                }
                                                                otherClassNames={
                                                                    "large"
                                                                }
                                                                loading={
                                                                    loading
                                                                }
                                                                openNewTicket={
                                                                    status ===
                                                                    LOADING
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {showTictketActionModal && (
                    <TicketCloseModal
                        showModal={showTictketActionModal}
                        closeModal={() => toggleTicketActionModal(false)}
                        referenceData={selectedTicket}
                        handleSuccess={handleTicketCloseSuccess}
                        handleTicketCloseSuccess={handleTicketCloseSuccess}
                    />
                )}
            </SocketContext.Provider>
        </>
    );
};

export default Chat;
