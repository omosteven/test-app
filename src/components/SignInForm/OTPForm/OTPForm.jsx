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
    pinLength = 6,
    redirectUser = true,
    handleSuccess,
    userId,
    isDirectUser,
}) => {
    const {
        chatSettings: { workspaceSlug },
    } = useSelector((state) => state.chat);
    const { email, sessionId } = initialStepRequest;

    const [errorMsg, setErrorMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [request, updateRequest] = useState();

    const [deviceToken, setDeviceToken] = useState();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
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
                await pushToDashboard(data, () => {
                    // history.replace(`);
                });
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

    const setDevicePushToken = async () => {
        let devicePushToken = await getDevicePushToken();
        setDeviceToken(devicePushToken);
    };

    useEffect(() => {
        setDevicePushToken();
    }, []);

    return (
        <div>
            <div className='otp__form'>
                <div>
                    <h5 className='signin-header'>Enter OTP</h5>
                    <p className='signin-sub__text'>
                        {isDirectUser ? (
                            <>
                                Enter the code sent to <strong>{email}</strong>{" "}
                                to complete your account verification.
                            </>
                        ) : (
                            <>
                                Hello <strong>{email}</strong>, an email has
                                been sent to you containing an OTP code which is
                                required to log you into your account. Please
                                check and enter the code received.
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
                            onChange={(otp) =>
                                updateRequest({ ...request, otp })
                            }
                            type='numeric'
                            inputMode='number'
                            inputStyle={{
                                border: "1px solid #DEE1E5",
                                color: "#11142D",
                            }}
                            // inputFocusStyle={{ border: "1px solid #6837EF" }}
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
