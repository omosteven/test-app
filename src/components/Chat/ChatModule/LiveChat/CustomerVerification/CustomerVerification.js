import EmailForm from "components/SignInForm/EmailForm/EmailForm";
import OTPForm from "components/SignInForm/OTPForm/OTPForm";

import { useState } from "react";
import CustomerVerifySuccess from "./CustomerVerifySuccess/CustomerVerifySuccess";
import "./CustomerVerification.scss";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import FadeIn from "components/ui/FadeIn";
import { deleteTicketsMessages } from "store/tickets/actions";
import { ADD_EMAIL_ADDRESS } from "../MessageBody/Messages/enums";
import { useDispatch } from "react-redux";

export const verifystages = {
    initial: "INPUT_EMAIL",
    final: "INPUT_OTP",
    success: "SUCCESS",
};

const CustomerVerification = ({ customer, handleVerifyAction, messages }) => {
    const [verifyStage, setVerifyStage] = useState(verifystages.initial);
    const [initialStepRequest, setinitialStepRequest] = useState();

    const handleInitialRequestUpdate = (data) => {
        setinitialStepRequest(data);
        setVerifyStage(verifystages.final);
    };

    const dispatch = useDispatch();

    const handleSuccess = () => {
        setVerifyStage(verifystages.success);

        let { messageId, ticketId } = messages?.find(
            (ticketMessage) =>
                ticketMessage?.messageActionType === ADD_EMAIL_ADDRESS
        );

        dispatch(
            deleteTicketsMessages({
                messageId,
                ticketId,
            })
        );
    };

    const renderBasedOnStage = () => {
        const { initial, final, success } = verifystages;
        switch (verifyStage) {
            case initial:
                return (
                    <EmailForm
                        userId={customer?.userId}
                        handleInitialRequestUpdate={handleInitialRequestUpdate}
                        title='Verify email address'
                        subTitle='We’ll send you a 4 digit OTP to ensure this is your email address.'
                    />
                );

            case final:
                return (
                    <OTPForm
                        initialStepRequest={initialStepRequest}
                        pinLength={4}
                        redirectUser={false}
                        userId={customer?.userId}
                        handleSuccess={handleSuccess}
                        isDirectUser={true}
                    />
                );

            case success:
                return (
                    <CustomerVerifySuccess closeModal={handleVerifyAction} />
                );

            default:
                return "";
        }
    };

    return (
        <FadeIn location={verifyStage}>
            <div className='customer-verification signin'>
                <div
                    className='customer-verify__icon'
                    onClick={() => handleVerifyAction()}>
                    <ReactSVG
                        src={imageLinks?.svg?.cancel}
                        className='verify-icon'
                    />
                </div>
                <div className='customer-verify__form'>
                    {renderBasedOnStage()}
                </div>
            </div>
        </FadeIn>
    );
};

export default CustomerVerification;
