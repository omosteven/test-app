import React, { useState } from "react";
import { useSelector } from "react-redux";
import FadeIn from "../ui/FadeIn";
import EmailForm from "./EmailForm/EmailForm";
import OTPForm from "./OTPForm/OTPForm";
import ChatHeader from "components/Chat/ChatModule/ChatHeader/ChatHeader";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { useWindowSize } from "utils/hooks";
import "./SignInForm.scss";

const { RELAXED } = defaultTemplates;

export const signInstages = {
    initial: "INPUT_EMAIL",
    final: "INPUT_OTP",
};

const SignInForm = () => {
    const [signInStage, setSignInStage] = useState(signInstages.initial);
    const [initialStepRequest, setinitialStepRequest] = useState();
    const { defaultTemplate } = useSelector((state) => state.chat.chatSettings);

    const { width } = useWindowSize();

    const handleInitialRequestUpdate = (data) => {
        setinitialStepRequest(data);
        setSignInStage(signInstages.final);
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    const isTablet = width <= 768;

    const renderBasedOnStage = () => {
        const { initial, final } = signInstages;
        switch (signInStage) {
            case initial:
                return (
                    <EmailForm
                        handleInitialRequestUpdate={handleInitialRequestUpdate}
                        subTitle={
                            isRelaxedTemplate &&
                            "Kindly give us your email address so we can proceed?"
                        }
                        title={isRelaxedTemplate && "Hi there!"}
                        bottomText={
                            isRelaxedTemplate &&
                            "Updates would be shared via this email"
                        }
                    />
                );

            case final:
                return (
                    <OTPForm
                        initialStepRequest={initialStepRequest}
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

    return (
        <FadeIn location={signInStage}>
            <div className='signin--container'>
                {isRelaxedTemplate && (
                    <ChatHeader showActions={false} isAuthPage={true} />
                )}
                <div className='row justify-content-center align-items-center form-area signin-con'>
                    <div
                        // className='col-lg-4 col-md-6 col-sm-8 col-12'
                        key={signInStage}>
                        <div className='signin otp__group'>
                            {renderBasedOnStage()}
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default SignInForm;
