import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, ErrorDialog } from "../../ui";
import PinInput from "react-pin-input";
import { getErrorMessage } from "../../../utils/helper";
import API from "../../../lib/api";
import apiRoutes from "../../../lib/api/apiRoutes";
import { ResendOTP } from "./ResendOTP/ResendOTP";
import pushToDashboard from "../actions";
import { getDevicePushToken } from "../../../lib/firebase/firebase";
import "./OTPForm.scss";

const OTPForm = ({
    initialStepRequest,
    pinLength = 4,
    redirectUser = true,
    handleSuccess,
    userId,
    isDirectUser,
    title,
    subTitle,
    isLinkEmail,
}) => {
    const { workspaceSlug } = useSelector((state) => state?.chat?.chatSettings);
    const { email, sessionId } = initialStepRequest;
    const [errorMsg, setErrorMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [request, updateRequest] = useState();
    const [deviceToken, setDeviceToken] = useState();

    const validateSessionOtp = async () => {
        try {
            setErrorMsg("");
            setLoading(true);
            const url = apiRoutes?.validateSessionOtp(sessionId);
            const res = await API.get(url, {
                params: {
                    otp: request?.otp,
                    deviceToken,
                    userId,
                },
            });
            if (res.status === 200) {
                const { data } = res.data;

                pushToDashboard(data);
                if (redirectUser) {
                    window.location.href = `/chat?workspaceSlug=${workspaceSlug}`;
                } else {
                    handleSuccess?.();
                }
            }
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
            setLoading(false);
        }
    };

    const validateAttachmentSessionOtp = async () => {
        try {
            setErrorMsg("");
            setLoading(true);
            const url = apiRoutes?.validateAttachmentSessionOtp(sessionId);
            const res = await API.get(url, {
                params: {
                    otp: request?.otp,
                },
            });

            if (res.status === 200) {
                const { data } = res.data;

                pushToDashboard(data);
                handleSuccess?.();
                // history.push(`/chat?workspaceSlug=${workspaceSlug}`);
            }
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
            setLoading(false);
        }
    };

    const setDevicePushToken = async () => {
        let devicePushToken = await getDevicePushToken();
        setDeviceToken(devicePushToken);
    };

    useEffect(() => {
        setDevicePushToken();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        isLinkEmail ? validateAttachmentSessionOtp() : validateSessionOtp();
    };

    return (
        <div>
            <div className='otp__form'>
                <div>
                    <h5 className='signin-header'>
                        {/* {title ? title : "Enter OTP"} */}
                        We’ve sent an OTP to <span>{email}</span>
                    </h5>
                    <p className='signin-sub__text'>
                        {isDirectUser ? (
                            <>
                                {subTitle ? (
                                    subTitle
                                ) : (
                                    <>
                                        {" "}
                                        Enter the code sent{" "}
                                        {email ? (
                                            <>
                                                to <strong>{email}</strong>
                                            </>
                                        ) : (
                                            ""
                                        )}{" "}
                                        to complete your account verification.
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {subTitle ? (
                                    subTitle
                                ) : (
                                    <>
                                        Hello <strong>{email}</strong>, an email
                                        has been sent to you containing an OTP
                                        code which is required to log you into
                                        your account. Please check and enter the
                                        code received.
                                    </>
                                )}
                            </>
                        )}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <ErrorDialog
                            show={Boolean(errorMsg)}
                            message={errorMsg}
                            hide={() => setErrorMsg()}
                        />
                        <PinInput
                            length={pinLength}
                            onComplete={(otp) =>
                                updateRequest({ ...request, otp })
                            }
                            type='numeric'
                            inputMode='number'
                            autoSelect={true}
                            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                        />
                        <Button
                            type='submit'
                            text={"Continue"}
                            classType='primary'
                            otherClass='my-3 w-100'
                            disabled={
                                loading || request?.otp?.length !== pinLength
                            }
                            loading={loading}
                        />
                    </form>
                    <ResendOTP
                        {...{
                            sessionId,
                            setErrorMsg,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OTPForm;
