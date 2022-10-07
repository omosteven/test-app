import ChatToastNotification from "components/Chat/ChatToastNotification/ChatToastNotification";
import { ToastContext } from "components/common/Toast/context/ToastContextProvider";
import { Button } from "components/ui";
import { useSelector } from "react-redux";

const CustomerVerifySuccess = ({ closeModal }) => {
    const {
        chatSettings: { workspaceSlug },
    } = useSelector((state) => state.chat);

    const handleContinue = async () => {
        window.location.href = `/chat?workspaceSlug=${workspaceSlug}`;
        closeModal();
    };

    return (
        <>
            <div>
                <h5 className='signin-header'>Verification successful.</h5>
                <p className='signin-sub__text'>
                    We have successfully verified your account and your ticket
                    has been saved.
                </p>
                <Button
                    type='submit'
                    text={"Continue"}
                    classType='primary'
                    otherClass='my-3 w-100'
                    onClick={handleContinue}
                />
            </div>
        </>
    );
};

export default CustomerVerifySuccess;
