import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import FadeIn from "../ui/FadeIn";
import EmailForm from "./EmailForm/EmailForm";
import OTPForm from "./OTPForm/OTPForm";
import ChatHeader from "components/Chat/ChatModule/ChatHeader/ChatHeader";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import InAppAuth from "./InAppAuth/InAppAuth";
import queryString from "query-string";
import { generateRandomId } from "utils/helper";
import { signInstages, emailFormActions, inAppAuthActions } from "./enum";

import "./SignInForm.scss";

const { RELAXED, WORKMODE } = defaultTemplates;
const { ASK__SUPPORT, OPEN_OLD_CONVERSATIONS } = inAppAuthActions;
const { ADD_EMAIL, ADD_NAME } = emailFormActions;

const SignInForm = () => {
    const { initial, email_stage, final } = signInstages;

    const [signInStage, setSignInStage] = useState(email_stage);
    const [emailStepRequest, setEmailStepRequest] = useState();
    const { defaultTemplate, workspaceSlug } = useSelector(
        (state) => state.chat.chatSettings
    );
    const [initialStageAction, setInitialStageAction] = useState(
        OPEN_OLD_CONVERSATIONS
    );

    const history = useHistory();

    const Queryparams = queryString.parse(window.location.search);
    const firstName = Queryparams?.firstName || "";
    const lastName = Queryparams?.lastName || "";
    const email = Queryparams?.email || "";
    const appUserId = Queryparams?.appUserId || generateRandomId();

    const routeToChat = (firstName, lastName, conversationId) => {
        conversationId
            ? history.push(
                  `/link?workspaceSlug=${workspaceSlug}&conversationId=${conversationId}&appUserId=${`${appUserId}`}&email=${email}`
              )
            : history.push(
                  `/link?workspaceSlug=${workspaceSlug}&appUserId=${`${firstName}${lastName}${appUserId}`}&firstName=${firstName}&lastName=${lastName}&email=${email}`
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

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORKMODE;
    const isNameRequest = initialStageAction === ASK__SUPPORT;
    const isEmailStage = signInStage === email_stage;

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
                        isEmailStage={isEmailStage}
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
                                        We’ve sent an OTP to your email
                                    </span>
                                    <span className='show-only-on-mobile'>
                                        We’ve sent an OTP <br /> to your email
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

    return (
        <FadeIn location={signInStage}>
            <div className='signin--container'>
                {isRelaxedTemplate && (
                    <ChatHeader
                        showActions={false}
                        isAuthPage={true}
                        alignLeft={isInitialStage}
                    />
                )}
                <div
                    className={`row justify-content-center align-items-center form-area signin-con ${
                        isInitialStage ? "initial__container" : ""
                    }`}>
                    <div key={signInStage}>
                        <div
                            className={`signin otp__group ${
                                isInitialStage ? "initial__content" : ""
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
