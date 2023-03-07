import React from "react";
import EmailForm from "components/SignInForm/EmailForm/EmailForm";
import OTPForm from "components/SignInForm/OTPForm/OTPForm";
import { useState } from "react";
import CustomerVerifySuccess from "./CustomerVerifySuccess/CustomerVerifySuccess";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import FadeIn from "components/ui/FadeIn";
import "./CustomerVerification.scss";
import { VERIFY_USER_ACTIONS } from "components/Chat/enums";

export const verifystages = {
    initial: "INPUT_EMAIL",
    final: "INPUT_OTP",
    success: "SUCCESS",
};

const CustomerVerification = ({
    customer,
    handleVerifyAction,
    messages,
    verifyUserAction,
}) => {
    const [verifyStage, setVerifyStage] = useState(verifystages.initial);
    const [initialStepRequest, setinitialStepRequest] = useState();

    const handleEmailRequestUpdate = (data) => {
        setinitialStepRequest(data);
        setVerifyStage(verifystages.final);
    };

    const handleSuccess = () => {
        setVerifyStage(verifystages.success);
    };

    const isSaveConvoAction =
        verifyUserAction === VERIFY_USER_ACTIONS.SAVE_CONVERSATION;

    const renderBasedOnStage = () => {
        const { initial, final, success } = verifystages;
        switch (verifyStage) {
            case initial:
                return (
                    <EmailForm
                        userId={customer?.userId}
                        handleEmailRequestUpdate={handleEmailRequestUpdate}
                        title={
                            isSaveConvoAction
                                ? "Save conversation"
                                : "Verify email address"
                        }
                        subTitle={
                            isSaveConvoAction
                                ? "Kindly give us your email address so we can save this conversation"
                                : "We’ll send you a 4 digit OTP to ensure this is your email address."
                        }
                        bottomText='This email address will be used to communicate updates with you.'
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
                    <CustomerVerifySuccess
                        closeModal={handleVerifyAction}
                        messages={messages}
                    />
                );

            default:
                return "";
        }
    };

    return (
        <FadeIn location={verifyStage}>
            <div className='customer-verification signin'>
                {!isSaveConvoAction && (
                    <div
                        className='customer-verify__icon'
                        onClick={() => handleVerifyAction()}>
                        <ReactSVG
                            src={imageLinks?.svg?.cancel}
                            className='verify-icon'
                        />
                    </div>
                )}
                <div className='customer-verify__form customer-save__action'>
                    {renderBasedOnStage()}
                </div>
            </div>
        </FadeIn>
    );
};

export default CustomerVerification;
