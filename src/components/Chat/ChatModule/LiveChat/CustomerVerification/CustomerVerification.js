import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EmailForm from "components/SignInForm/EmailForm/EmailForm";
import ErrorView from "components/common/ErrorView/ErrorView";
import { DotLoader } from "components/ui";
import OTPForm from "components/SignInForm/OTPForm/OTPForm";
import CustomerVerifySuccess from "./CustomerVerifySuccess/CustomerVerifySuccess";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import FadeIn from "components/ui/FadeIn";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { getErrorMessage, validateEmail } from "utils/helper";
import { VERIFY_USER_ACTIONS } from "components/Chat/enums";
import { dataQueryStatus } from "utils/formatHandlers";
import { useHistory } from "react-router-dom";
import "./CustomerVerification.scss";

export const verifystages = {
    initial: "INPUT_EMAIL",
    final: "INPUT_OTP",
    success: "SUCCESS",
};

const { ERROR, DATAMODE, LOADING } = dataQueryStatus;

const CustomerVerification = ({
    customer,
    handleVerifyAction,
    messages,
    verifyUserAction,
}) => {
    const isSaveConvoAction =
        verifyUserAction === VERIFY_USER_ACTIONS.SAVE_CONVERSATION;
    const { initial, final, success } = verifystages;
    const {
        user: { email, userId },
    } = useSelector((state) => state.auth);
    const history = useHistory();

    const isLinkEmail = history?.location?.pathname === "/conversation";

    const [verifyStage, setVerifyStage] = useState(
        !isLinkEmail ? initial : final
    );
    const [initialStepRequest, setinitialStepRequest] = useState();
    const [status, setStatus] = useState(!isLinkEmail ? DATAMODE : LOADING);
    const [errorMssg, setErrorMssg] = useState("");

    const handleEmailRequestUpdate = (data) => {
        setinitialStepRequest(data);
        setVerifyStage(verifystages.final);
    };

    const linkEmail = async () => {
        try {
            setStatus(LOADING);
            const url = apiRoutes.linkEmail;
            const res = await API.get(url);

            if (res.status === 200) {
                const { data } = res.data;
                setinitialStepRequest({ sessionId: data });
                setStatus(DATAMODE);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    useEffect(() => {
        if (isLinkEmail) {
            linkEmail();
        }
        //eslint-disable-next-line
    }, []);

    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return <DotLoader />;
            case DATAMODE:
                return <>{renderBasedOnStage()}</>;
            case ERROR:
                return (
                    <ErrorView message={errorMssg} retry={() => linkEmail()} />
                );
            default:
                return "";
        }
    };

    const handleSuccess = () => {
        setVerifyStage(verifystages.success);
    };

    const renderBasedOnStage = () => {
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
                        isLinkEmail={isLinkEmail}
                        subTitle={
                            validateEmail(email || userId) &&
                            `at ${email || userId}`
                        }
                    />
                );

            case success:
                return (
                    <CustomerVerifySuccess
                        closeModal={handleVerifyAction}
                        messages={messages}
                        redirectUser={isLinkEmail}
                    />
                );

            default:
                return "";
        }
    };

    return (
        <FadeIn location={verifyStage}>
            <div className='customer-verification signin'>
                {!isSaveConvoAction && !isLinkEmail && (
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
                    {renderBasedOnStatus()}
                </div>
            </div>
        </FadeIn>
    );
};

export default CustomerVerification;
