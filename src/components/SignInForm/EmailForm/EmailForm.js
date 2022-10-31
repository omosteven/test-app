import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import API from "../../../lib/api";
import apiRoutes from "../../../lib/api/apiRoutes";
import { getErrorMessage } from "../../../utils/helper";
import ValidateForm from "../../../utils/validations/validator";
import { Button, ErrorDialog, Input } from "../../ui";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import "./EmailForm.scss";

const EmailForm = ({ handleInitialRequestUpdate, title, subTitle, userId }) => {
    const {
        chatSettings: { teamName, workspaceId },
    } = useSelector((state) => state.chat);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [request, setRequest] = useState({
        // conversationId: conversationId,
        email: "",
        workspaceId,
        userId,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequest({ ...request, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const intiateChatForUser = async () => {
        try {
            setErrorMsg("");
            setLoading(true);
            const res = await API.post(apiRoutes.authenticate, request);
            if (res.status === 201) {
                const { sessionId } = res.data.data;
                const { email } = request;
                handleInitialRequestUpdate({ sessionId, email });
            }
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { formisValid, errors: formErrors } = ValidateForm(e, request);
        if (formisValid) {
            intiateChatForUser();
        }
        setErrors(formErrors);
    };

    const { email } = request;

    return (
        <div>
            <h5 className='signin-header'>{title ? title : "Hello,"}</h5>
            <p className='signin-sub__text'>
                {subTitle ? (
                    subTitle
                ) : (
                    <>
                        Welcome to <strong>{teamName}</strong>. To enable us
                        solve your issue easily, kindly enter your email address
                        below.
                    </>
                )}
            </p>
            <form onSubmit={handleSubmit}>
                <ErrorDialog
                    show={Boolean(errorMsg)}
                    message={errorMsg}
                    hide={() => setErrorMsg()}
                />
                <Input
                    type='email'
                    placeholder='Enter your email address'
                    name='email'
                    id='email'
                    inputClass='py-3'
                    data-label='Email address'
                    value={email}
                    label='Email'
                    onChange={handleChange}
                    isErr={errors?.email}
                    errMssg={errors?.email}
                    hideLabel={true}
                />
                <Button
                    type='submit'
                    text={"Continue"}
                    classType='primary'
                    otherClass='my-3 w-100'
                    loading={loading}
                />
            </form>
            <div className='info__section d-flex align-items-center'>
                <ReactSVG src={imageLinks.svg.info} className='info-icon' />
                <p>
                    This email address would be used to communicate updates with
                    you
                </p>
            </div>
        </div>
    );
};

export default EmailForm;
