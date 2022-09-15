import { useCallback, createContext, useState } from "react";
import {
    ToastsContainer,
    ToastsContainerPosition,
    ToastsStore,
} from "react-toasts";
import { dataQueryStatus } from "../../../../utils/formatHandlers";
import ToastContent from "../content/ToastContent";
import "./ToastContextProvider.scss";

export const ToastContext = createContext();

const ToastContextProvider = ({ children }) => {
    const [timeOut, setTimeOut] = useState(5000);

    const handleClose = () => {
        setTimeOut(0);
    };

    const toastMessage = useCallback(function (message, type) {
        let messageValueType = typeof message;
        if (messageValueType === "array") {
            message = message[0];
        }

        if (type === dataQueryStatus.ERROR) {
            ToastsStore.error(
                <ToastContent
                    message={message}
                    isError={true}
                    handleClose={handleClose}
                />,
                timeOut
            );
        } else {
            ToastsStore.success(
                <ToastContent
                    message={message}
                    isError={false}
                    handleClose={handleClose}
                />,
                timeOut
            );
        }
    },[timeOut]);

    return (
        <ToastContext.Provider value={toastMessage}>
            {children}
            <ToastsContainer
                store={ToastsStore}
                position={ToastsContainerPosition.TOP_CENTER}
                lightBackground
            />
        </ToastContext.Provider>
    );
};

export default ToastContextProvider;
