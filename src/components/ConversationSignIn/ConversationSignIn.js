import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import queryString from "query-string";
import FadeIn from "components/ui/FadeIn";
import ChatHeader from "components/Chat/ChatModule/ChatHeader/ChatHeader";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import ConversationSignInEmailForm from "./ConversationSignInEmailForm/ConversationSignInEmailForm";
import OTPForm from "components/SignInForm/OTPForm/OTPForm";
import { signInstages } from "components/SignInForm/enum";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { setActiveTicket } from "store/tickets/actions";
import { dataQueryStatus } from "utils/formatHandlers";
import ErrorView from "components/common/ErrorView/ErrorView";
import { getErrorMessage } from "utils/helper";
import "../SignInForm/SignInForm.scss";
import { pushAuthUser } from "store/auth/actions";

const { RELAXED } = defaultTemplates;
const { ERROR, DATAMODE } = dataQueryStatus;

const ConversationSignIn = () => {
    const { email_stage, final } = signInstages;

    const { defaultTemplate, workspaceSlug } = useSelector(
        (state) => state.chat.chatSettings
    );
    const [signInStage, setSignInStage] = useState(email_stage);
    const [emailStepRequest, setEmailStepRequest] = useState();
    const [status, setStatus] = useState(DATAMODE);
    const [errorMssg, setErrorMssg] = useState("");

    const params = queryString.parse(window.location.search);
    const conversationId = params?.conversationId;

    const dispatch = useDispatch();
    const history = useHistory();

    const handleEmailRequestUpdate = (data) => {
        setEmailStepRequest(data);
        setSignInStage(final);
    };

    const engageConversation = async () => {
        try {
            setErrorMssg();
            const url = apiRoutes?.engageConversation(conversationId);
            const res = await API.get(url);

            if (res.status === 200) {
                const { data } = res.data;
                const { customer } = data || {};

                dispatch(
                    setActiveTicket({
                        ...data,
                    })
                );

                if (customer) {
                    dispatch(pushAuthUser(customer));
                }

                await window.history.replaceState(
                    null,
                    "New Conversation",
                    `/chat?workspaceSlug=${workspaceSlug}`
                );
                await window.location.reload();
                // window.location.reload();
                // history.push(`/chat?workspaceSlug=${workspaceSlug}`);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleSuccess = () => {
        console.log("Called to handle Success");
        console.log("conversationId", conversationId);
        if (conversationId) {
            engageConversation();
        } else {
            history.push(`/chat?workspaceSlug=${workspaceSlug}`);
        }
    };

    const renderBasedOnStatus = () => {
        switch (status) {
            case DATAMODE:
                return <>{renderBasedOnStage()}</>;
            case ERROR:
                return (
                    <ErrorView
                        message={errorMssg}
                        retry={() => engageConversation()}
                    />
                );
            default:
                return "";
        }
    };

    const renderBasedOnStage = () => {
        switch (signInStage) {
            case email_stage:
                return (
                    <ConversationSignInEmailForm
                        handleEmailRequestUpdate={handleEmailRequestUpdate}
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
                        redirectUser={false}
                        handleSuccess={handleSuccess}
                    />
                );

            default:
                return "";
        }
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    return (
        <FadeIn location={signInStage}>
            <div className='signin--container'>
                {isRelaxedTemplate && (
                    <ChatHeader showActions={false} isAuthPage={true} />
                )}
                <div
                    className={`row justify-content-center align-items-center form-area signin-con
                `}>
                    <div>
                        <div className={`signin otp__group`}>
                            {renderBasedOnStatus()}
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default ConversationSignIn;
