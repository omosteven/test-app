import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, ErrorDialog } from "../../ui";
import PinInput from "react-pin-input";
import { getErrorMessage } from "../../../utils/helper";
import API from "../../../lib/api";
import apiRoutes from "../../../lib/api/apiRoutes";
import { ResendOTP } from "./ResendOTP/ResendOTP";
import pushToDashboard from "../actions";
import { getDevicePushToken } from "../../../lib/firebase/firebase";

const OTPForm = ({ initialStepRequest }) => {
    const {
        chatSettings: { workspaceSlug },
    } = useSelector((state) => state.chat);
    const history = useHistory();
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
                },
            });
            if (res.status === 200) {
                const { data } = res.data;
                pushToDashboard(data, () => {
                    history.replace(`/chat?workspaceSlug=${workspaceSlug}`);
                    window.location.reload();
                });
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
                        Hello <strong>{email}</strong>, an email has been sent
                        to you containing an OTP code which is required to log
                        you into your account. Please check and enter the code
                        received.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <ErrorDialog
                            show={Boolean(errorMsg)}
                            message={errorMsg}
                            hide={() => setErrorMsg()}
                        />
                        <PinInput
                            length={6}
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
                            disabled={loading || request?.otp?.length !== 6}
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
