import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import FadeIn from "../ui/FadeIn";
import EmailForm from "./EmailForm/EmailForm";
import OTPForm from "./OTPForm/OTPForm";
import ChatHeader from "components/Chat/ChatModule/ChatHeader/ChatHeader";
import InAppAuth from "./InAppAuth/InAppAuth";
import queryString from "query-string";
import { buildRouteLink, generateRandomId, truncate } from "utils/helper";
import { signInstages, emailFormActions, inAppAuthActions } from "./enum";
import { useWindowSize } from "utils/hooks";
import "./SignInForm.scss";
import { isLiveApp } from "config/config";

const { ASK__SUPPORT, OPEN_OLD_CONVERSATIONS } = inAppAuthActions;
const { ADD_EMAIL, ADD_NAME } = emailFormActions;

const SignInForm = () => {
    const { initial, email_stage, final } = signInstages;

    const [signInStage, setSignInStage] = useState(initial);
    const [emailStepRequest, setEmailStepRequest] = useState();
    const { workspaceSlug } = useSelector((state) => state.chat.chatSettings);
    const [initialStageAction, setInitialStageAction] = useState(
        OPEN_OLD_CONVERSATIONS
    );

    const history = useHistory();

    const Queryparams = queryString.parse(window.location.search);
    const firstName = Queryparams?.firstName;
    const lastName = Queryparams?.lastName;
    const email = Queryparams?.email;
    const appUserId = Queryparams?.appUserId || generateRandomId();

    const routeToChat = (firstName, lastName, conversationId) => {
        history.push(
            buildRouteLink(
                email,
                firstName,
                lastName,
                conversationId,
                isLiveApp,
                workspaceSlug,
                appUserId
            )
        );
    };

    const handleAskAction = () => {
        if (firstName || lastName) {
            routeToChat(firstName, lastName);
        } else {
            setInitialStageAction(ASK__SUPPORT);
            setSignInStage(signInstages.email_stage);
        }
    };

    const handleInitialRequestUpdate = (action) => {
        switch (action) {
            case ASK__SUPPORT:
                handleAskAction();
                break;
            case OPEN_OLD_CONVERSATIONS:
                setSignInStage(signInstages.email_stage);
                break;
            default:
                break;
        }
    };

    const handleEmailRequestUpdate = (data, action) => {
        switch (action) {
            case ADD_EMAIL:
                setEmailStepRequest(data);
                setSignInStage(signInstages.final);
                break;
            case ADD_NAME:
                const { fullname } = data;
                const firstName = fullname.split(" ")[0] || "";
                const lastName = fullname.split(" ")[1] || "";
                routeToChat(firstName, lastName);
                break;
            default:
                break;
        }
    };

    // const isRelaxedTemplate = defaultTemplate === RELAXED;
    // const isWorkModeTemplate = defaultTemplate === WORKMODE;

    const isRelaxedTemplate = true;
    const isWorkModeTemplate = false;
    // const isWorkModeTemplate = defaultTemplate === WORKMODE;
    const isNameRequest = initialStageAction === ASK__SUPPORT;

    const renderBasedOnStage = () => {
        switch (signInStage) {
            case initial:
                return (
                    <InAppAuth
                        handleInitialRequestUpdate={handleInitialRequestUpdate}
                        routeToChat={routeToChat}
                    />
                );

            case email_stage:
                return (
                    <EmailForm
                        handleEmailRequestUpdate={handleEmailRequestUpdate}
                        subTitle={
                            isRelaxedTemplate &&
                            `Enter your ${
                                isNameRequest ? "name" : "email address"
                            } so we can continue`
                        }
                        title={isRelaxedTemplate && "Hi there!"}
                        bottomText={
                            isWorkModeTemplate &&
                            "This email address will be used to communicate updates with you."
                        }
                        isNameRequest={isNameRequest}
                        routeToChat={routeToChat}
                    />
                );

            case final:
                return (
                    <OTPForm
                        initialStepRequest={emailStepRequest}
                        title={
                            isRelaxedTemplate && (
                                <>
                                    <span className='show-only-on-desktop'>
                                        We’ve sent an OTP to{" "}
                                        {truncate(emailStepRequest?.email, 25)}
                                    </span>
                                    <span className='show-only-on-mobile'>
                                        We’ve sent an OTP <br /> to{" "}
                                        {truncate(emailStepRequest?.email, 25)}
                                    </span>
                                </>
                            )
                        }
                        subTitle={
                            isRelaxedTemplate &&
                            "Check and enter the code received."
                        }
                    />
                );

            default:
                return <EmailForm setSignInStage={setSignInStage} />;
        }
    };

    const isInitialStage = signInStage === initial;
    const { width } = useWindowSize();
    const isTablet = width <= 768;

    return (
        <FadeIn location={signInStage}>
            <div className={isInitialStage ? "" : "signin--container"}>
                {isRelaxedTemplate && (
                    <>
                        {((isInitialStage && isTablet) || !isInitialStage) && (
                            <ChatHeader
                                showActions={isInitialStage ? true : false}
                                isAuthPage={true}
                                hideBackIcon={isInitialStage}
                                // alignLeft={isInitialStage}
                            />
                        )}
                    </>
                )}
                <div
                    className={`row justify-content-center align-items-center  signin-con ${
                        isInitialStage ? "initial__container" : "form-area"
                    }`}>
                    <div key={signInStage}>
                        <div
                            className={`signin  ${
                                isInitialStage
                                    ? "initial__content"
                                    : "otp__group"
                            }`}>
                            {renderBasedOnStage()}
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default SignInForm;
