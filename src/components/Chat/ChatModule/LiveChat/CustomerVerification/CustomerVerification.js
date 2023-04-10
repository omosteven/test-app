import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import BannerMessage from "components/ui/BannerMessage/BannerMessage";
import {
    deleteTicketsMessages,
    saveTicketsMessages,
} from "store/tickets/actions";
import { ADD_EMAIL_ADDRESS } from "../MessageBody/Messages/enums";
import {
    messageTypes,
    appMessageUserTypes,
} from "../MessageBody/Messages/enums";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { generateID } from "utils/helper";
import "./CustomerVerification.scss";

export const verifystages = {
    initial: "INPUT_EMAIL",
    final: "INPUT_OTP",
    success: "SUCCESS",
};

const { SUCCESS } = messageTypes;
const { RELAXED } = defaultTemplates;
const { WORKSPACE_AGENT } = appMessageUserTypes;
const { ERROR, DATAMODE, LOADING } = dataQueryStatus;

const CustomerVerification = ({
    customer,
    handleVerifyAction,
    messages,
    verifyUserAction,
    ticketId,
}) => {
    const isSaveConvoAction =
        verifyUserAction === VERIFY_USER_ACTIONS.SAVE_CONVERSATION;
    const { initial, final, success } = verifystages;

    const {
        user: { email, userId },
    } = useSelector((state) => state.auth);
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const history = useHistory();
    const dispatch = useDispatch();

    const isLinkEmail =
        history?.location?.pathname === "/conversation" ||
        validateEmail(email || userId);

    const [verifyStage, setVerifyStage] = useState(
        !isLinkEmail ? initial : final
    );
    const [initialStepRequest, setinitialStepRequest] = useState();
    const [status, setStatus] = useState(!isLinkEmail ? DATAMODE : LOADING);
    const [errorMssg, setErrorMssg] = useState("");
    const [showBannerMessage, toggleBannerMessage] = useState(true);

    const isRelaxedTemplate = defaultTemplate === RELAXED;

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

    const handleEmailVerificationSuccess = () => {
        const { messageId } =
            messages?.find(
                (ticketMessage) =>
                    ticketMessage?.messageActionType === ADD_EMAIL_ADDRESS &&
                    ticketMessage?.ticketId === ticketId
            ) || {};

        if (messageId) {
            dispatch(
                deleteTicketsMessages({
                    messageId,
                    ticketId,
                })
            );
        }

        if (isRelaxedTemplate) {
            dispatch(
                saveTicketsMessages({
                    ticketId,
                    messageId: generateID(),
                    messageContent:
                        "We have successfully verified your account and your ticket has been saved.",
                    messageHeader: "Email verification successful",
                    messageType: SUCCESS,
                    senderType: WORKSPACE_AGENT,
                })
            );
        }
    };

    useEffect(() => {
        if (verifyStage === success) {
            handleEmailVerificationSuccess();
        }
        // eslint-disable-next-line
    }, [verifyStage]);

    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <div className='customer-verify__loader__container'>
                        <DotLoader />
                    </div>
                );
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
                    <div>
                        {showBannerMessage && verifyStage !== success && (
                            <div className='customer-verify__banner__message__wrapper'>
                                <BannerMessage
                                    onClose={() => toggleBannerMessage(false)}>
                                    We will never ask you for your PIN or
                                    password
                                </BannerMessage>
                            </div>
                        )}
                        {renderBasedOnStatus()}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default CustomerVerification;
