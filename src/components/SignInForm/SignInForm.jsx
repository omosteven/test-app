import { useState } from "react";
import FadeIn from "../ui/FadeIn";
import EmailForm from "./EmailForm/EmailForm";
import OTPForm from "./OTPForm/OTPForm";

export const signInstages = {
    initial: "INPUT_EMAIL",
    final: "INPUT_OTP",
};

const SignInForm = () => {
    const [signInStage, setSignInStage] = useState(signInstages.initial);
    const [initialStepRequest, setinitialStepRequest] = useState();

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

    return (
        <FadeIn location={signInStage}>
            <div className='row justify-content-center align-items-center form-area'>
                <div
                    className='col-lg-4 col-md-5 col-sm-8 col-12'
                    key={signInStage}>
                    <div className='otp__group'>{renderBasedOnStage()}</div>
                </div>
            </div>
        </FadeIn>
    );
};

export default SignInForm;
