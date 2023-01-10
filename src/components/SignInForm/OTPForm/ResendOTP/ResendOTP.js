import { useState } from "react";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { dataQueryStatus } from "utils/formatHandlers";
import { getErrorMessage } from "utils/helper";
import "./ResendOTP.scss";

const { IDLE, LOADING, SUCCESS } = dataQueryStatus;

export const ResendOTP = ({ setErrorMsg, sessionId }) => {
    const [status, setStatus] = useState(IDLE);
    const [timeLeft, setTimeLeft] = useState(null);

    const resendOtp = async () => {
        try {
            setStatus(LOADING);
            setErrorMsg();

            const url = apiRoutes.resendSessionOtp(sessionId);

            const res = await API.get(url);
            if (res.status === 200) {
                setStatus(SUCCESS);
                callTimer();
            }
        } catch (err) {
            setStatus(IDLE);
            setErrorMsg(getErrorMessage(err));
        }
    };

    const timer = (time, update, complete) => {
        const start = new Date().getTime();
        let interval = setInterval(function () {
            let now = time - (new Date().getTime() - start);
            if (now <= 0) {
                clearInterval(interval);
                complete();
            } else update(Math.floor(now / 1000));
        }, 100);
    };

    const callTimer = () => {
        timer(
            61000,
            (timeleft) => {
                let minLeft = Math.floor(timeleft / 60);
                let secsLeft = timeleft % 60;
                if (secsLeft < 10) secsLeft = "0" + secsLeft;
                const time = "0" + minLeft + ":" + secsLeft;
                setTimeLeft(time);
            },
            () => {
                setTimeLeft(null);
                setStatus(IDLE);
                // dispatch(_clearAlert());
            }
        );
    };

    return status === SUCCESS ? (
        <p className='resend__otp__text'>
            Resend in{" "}
            <span className='resend__otp__text fw-medium'>{timeLeft}</span>
        </p>
    ) : (
        <p className='resend__otp__text'>
            Didn’t receive OTP via email?{" "}
            <span className='resend__otp__action' onClick={resendOtp}>
                Resend{status === LOADING ? "ing OTP..." : " OTP"}
            </span>
        </p>
    );
};
