import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import API from "../../lib/api";
import apiRoutes from "../../lib/api/apiRoutes";
import { onMessageListener } from "../../lib/firebase/firebase";
import {
    reconnectSocket,
    socket,
    SocketContext,
} from "../../lib/socket/context/socket";
import { retriveAccessToken } from "storage/sessionStorage";
import { setActiveTicket } from "../../store/tickets/actions";
import { dataQueryStatus } from "../../utils/formatHandlers";
import { generateRandomId, getErrorMessage } from "../../utils/helper";
import Empty from "../common/Empty/Empty";
import { ToastContext } from "../common/Toast/context/ToastContextProvider";
import queryString from "query-string";
import ChatHeader from "./ChatModule/ChatHeader/ChatHeader";
import ChatModule from "./ChatModule/ChatModule";
import ChatToastNotification from "./ChatToastNotification/ChatToastNotification";
import NewTicketButton from "./CustomerTicketsContainer/CustomerTickets/common/NewTicketButton/NewTicketButton";
import { pushAuthUser } from "store/auth/actions";
import TicketCloseModal from "./TicketCloseModal/TicketCloseModal";
import { defaultTemplates, defaultThemes } from "hoc/AppTemplateWrapper/enum";
import { DotLoader } from "components/ui";
import { useWindowSize } from "utils/hooks";
import pushToDashboard from "components/SignInForm/actions";
import { storeUserAuth } from "storage/sessionStorage";
import "./Chat.scss";

const { ERROR, LOADING, DATAMODE, NULLMODE } = dataQueryStatus;
const { RELAXED } = defaultTemplates;
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

    const { user } = useSelector((state) => state.auth);

    const selectedTicket = activeTicket;
    const [customerTickets, setCustomerTickets] = useState([]);

    const [showVerifyForm, setShowVerifyForm] = useState(false);
    const [verifyUserAction, setVerifyUserAction] = useState();

    const [socketConnection, setSocketConnection] = useState(socket);

    const queryParams = queryString.parse(window.location.search);

    const isTicketRoutedLink =
        window.location?.pathname === "/ticket" &&
        queryParams?.appUserId &&
        queryParams?.ticketId;

    const firstName = queryParams?.firstName || "";
    const lastName = queryParams?.lastName || "";
    const email = queryParams?.email || "";

    const appUserId =
        queryParams?.appUserId || user?.userId || generateRandomId();
    const conversationId = queryParams?.conversationId;

    const userToken = retriveAccessToken();

    const { defaultTemplate, defaultTheme, workspaceId, workspaceSlug } =
        useSelector((state) => state.chat.chatSettings);

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    const isDarkModeTheme = defaultTheme === DARK_MODE_DEFAULT;
    const isTablet = width <= 768;

    const getCustomerFromTicketLink = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            console.log("this ran in ticket link");
            const ticketId = queryParams?.ticketId;
            const userId = queryParams?.appUserId;

            const res = await API.post(apiRoutes.validateTicketUser, {
                ticketId,
                workspaceId,
                appUserId: userId,
            });

            if (res.status === 201) {
                const { data } = res.data;
                const { ticket: userTicket } = data;
                dispatch(setActiveTicket(userTicket));
                pushToDashboard(data);
                setStatus(DATAMODE);
                getCustomerTickets(userTicket?.ticketId);
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
            setStatus(LOADING);
            setErrorMssg();
            setLoading(true);
            const res = await API.get(apiRoutes.userTickets);
            if (res.status === 200) {
                const tickets = res.data.data;
                if (tickets.length > 0) {
                    setCustomerTickets(tickets);

                    const { ticketId: prevSelectedId } = activeTicket || {};

                    // const newTicket = ticketId
                    //     ? tickets?.find((x) => x.ticketId === ticketId)
                    //     : prevSelectedId
                    //     ? tickets?.find((x) => x.ticketId === prevSelectedId)
                    //     : tickets[0];

                    let selectedTicket = tickets?.find(
                        (x) => x.ticketId === ticketId
                    );
                    let prevSelectedTicket = tickets?.find(
                        (x) => x.ticketId === prevSelectedId
                    );

                    const newTicket = selectedTicket
                        ? selectedTicket
                        : prevSelectedTicket
                        ? prevSelectedTicket
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
                        storeUserAuth(customer);
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

    const validateUser = async () => {
        try {
            console.log("this ran in validate");
            setStatus(LOADING);
            setErrorMssg();

            const url = apiRoutes?.validateUser;
            const res = await API.post(url, {
                workspaceId,
                appUserId,
                firstName,
                lastName,
                email,
            });

            if (res.status === 201) {
                const { data } = res.data;

                pushToDashboard(data);

                if (conversationId) {
                    engageConversation();
                } else {
                    history.push(`/chat?workspaceSlug=${workspaceSlug}`);
                }
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const engageConversation = async () => {
        try {
            console.log("this ran in engage");
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.engageConversation(conversationId);
            const res = await API.get(url);

            if (res.status === 200) {
                const { data } = res.data;

                dispatch(
                    setActiveTicket({
                        ...data,
                    })
                );

                if (history?.location?.pathname !== "/conversation") {
                    history.push(`/chat?workspaceSlug=${workspaceSlug}`);
                }

                setStatus(DATAMODE);
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

    const handleVerifyAction = (verifyAction) => {
        setShowVerifyForm(!showVerifyForm);
        setVerifyUserAction(verifyAction);
    };

    const callHandler = () => {
        console.log("this ran in handler");
        conversationId
            ? engageConversation()
            : isTicketRoutedLink
            ? getCustomerFromTicketLink()
            : getCustomerTickets();
    };

    useEffect(() => {
        if (
            (userToken === undefined || userToken === null) &&
            !isTicketRoutedLink
        ) {
            validateUser();
        } else {
            callHandler();
        }
        //eslint-disable-next-line
    }, [appUserId, isTicketRoutedLink]);

    const handleCloseTicket = () => {
        toggleTicketActionModal(true);
    };

    const reconnectUser = () => {
        const socketReconnection = reconnectSocket(userToken);
        setSocketConnection(socketReconnection);
    };

    useEffect(() => {
        if (!socketConnection?.connected) {
            reconnectUser();
        }
        //eslint-disable-next-line
    }, [socket]);

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
                                    handleVerifyAction,
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
                                    reconnectUser={reconnectUser}
                                    verifyUserAction={verifyUserAction}
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
