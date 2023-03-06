import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import FadeIn from "../ui/FadeIn";
import EmailForm from "./EmailForm/EmailForm";
import OTPForm from "./OTPForm/OTPForm";
import ChatHeader from "components/Chat/ChatModule/ChatHeader/ChatHeader";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import InAppAuth from "./InAppAuth/InAppAuth";
import { inAppAuthActions } from "./InAppAuth/InAppAuth";
import queryString from "query-string";
import { generateRandomId } from "utils/helper";
import { emailFormActions } from "./EmailForm/EmailForm";
import "./SignInForm.scss";

const { RELAXED, WORKMODE } = defaultTemplates;
const { ASK__SUPPORT, OPEN_OLD_CONVERSATIONS } = inAppAuthActions;
const { ADD_EMAIL, ADD_NAME } = emailFormActions;

export const signInstages = {
    initial: "WELCOME_PAGE",
    email_stage: "INPUT_EMAIL",
    final: "INPUT_OTP",
};

const SignInForm = () => {
    const [signInStage, setSignInStage] = useState(signInstages.initial);
    const [emailStepRequest, setEmailStepRequest] = useState();
    const { defaultTemplate, workspaceSlug } = useSelector(
        (state) => state.chat.chatSettings
    );
    const { initial, email_stage, final } = signInstages;
    const [initialStageAction, setInitialStageAction] = useState("");

    const history = useHistory();

    const Queryparams = queryString.parse(window.location.search);
    const firstName = Queryparams?.firstName || "";
    const lastName = Queryparams?.lastName || "";
    const email = Queryparams?.email || "";
    const appUserId = Queryparams?.appUserId || generateRandomId();

    const handleAskAction = () => {
        if (firstName || lastName) {
            history.push(
                `/link?workspaceSlug=${workspaceSlug}&appUserId=${appUserId}&firstName=${firstName}&lastName=${lastName}&email=${email}`
            );
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
    console.log({ emailStepRequest, initialStageAction, appUserId });

    const handleEmailRequestUpdate = (data, action) => {
        console.log({ data });
        switch (action) {
            case ADD_EMAIL:
                setEmailStepRequest(data);
                setSignInStage(signInstages.final);
                break;
            case ADD_NAME:
                history.push(
                    `/link?workspaceSlug=${workspaceSlug}&appUserId=${appUserId}&firstName=${data?.name}&email=${email}`
                );
                break;
            default:
                break;
        }
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORKMODE;
    const isNameRequest = initialStageAction === ASK__SUPPORT;

    const renderBasedOnStage = () => {
        switch (signInStage) {
            case initial:
                return (
                    <InAppAuth
                        handleInitialRequestUpdate={handleInitialRequestUpdate}
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
                    <ChatHeader showActions={false} isAuthPage={true} />
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
