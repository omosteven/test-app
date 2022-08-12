import { useCallback, createContext } from "react";
import { toast, ToastContainer }  from "react-toasts";
import { dataQueryStatus } from "../../../../utils/formatHandlers";

export const ToastContext = createContext();

const ToastContextProvider = ({ children }) => {
    const toastMessage = useCallback( (message, type) => {
        let messageValueType = typeof message;
        if (messageValueType === "array") {
            message = message[0];
        }
        console.log(message, type)
        // console.log(toast)
         toast.notify(message, {
            title: " ",
            duration: 50,
            // type: 'success'

         })

    });

    return (
        <ToastContext.Provider value={toastMessage}>
            {children}
            <ToastContainer 
                id={'breakkkk'}
            />
        </ToastContext.Provider>
    );
};

export default ToastContextProvider;
