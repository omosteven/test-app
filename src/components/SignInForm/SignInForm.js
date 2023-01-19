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

    const renderBasedOnStage = () => {
        const { initial, final } = signInstages;
        switch (signInStage) {
            case initial:
                return (
                    <EmailForm
                        handleInitialRequestUpdate={handleInitialRequestUpdate}
                    />
                );

            case final:
                return <OTPForm initialStepRequest={initialStepRequest} />;

            default:
                return <EmailForm setSignInStage={setSignInStage} />;
        }
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    const isTablet = width <= 768;

    return (
        <FadeIn location={signInStage}>
            {isRelaxedTemplate && isTablet && (
                <ChatHeader showActions={false} />
            )}
            <div className='row justify-content-center align-items-center form-area'>
                <div
                    className='col-lg-4 col-md-5 col-sm-8 col-12'
                    key={signInStage}>
                    <div className='signin otp__group'>
                        {renderBasedOnStage()}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

//  <DatePickerUI />

export default SignInForm;
