import React from "react";
import queryString from "query-string";
import { useSelector } from "react-redux";
import { useState } from "react";
import API from "../../../lib/api";
import apiRoutes from "../../../lib/api/apiRoutes";
import { getErrorMessage } from "../../../utils/helper";
import ValidateForm from "../../../utils/validations/validator";
import { Button, ErrorDialog, Input } from "../../ui";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import pushToDashboard from "../actions";
import { emailFormActions } from "../enum";
import "./EmailForm.scss";

const { ADD_EMAIL, ADD_NAME } = emailFormActions;

const EmailForm = ({
    handleEmailRequestUpdate,
    title,
    subTitle,
    bottomText,
    userId,
    isNameRequest,
    routeToChat,
}) => {
    const {
        chatSettings: { teamName, workspaceId, workspaceSlug },
    } = useSelector((state) => state.chat);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    let params = queryString.parse(window.location.search);
    const conversationId = params?.conversationId;

    const [request, setRequest] = useState({
        conversationId: conversationId,
        email: "",
        workspaceId,
        userId,
        fullname: "",
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
            const { fullname, ...requestData } = request;
            const res = await API.post(apiRoutes.authenticate, requestData);

            if (res.status === 201) {
                const { data } = res?.data;
                const { sessionId } = data;
                const { email } = requestData;

                if (sessionId) {
                    handleEmailRequestUpdate({ sessionId, email }, ADD_EMAIL);
                } else {
                    pushToDashboard(data);
                    window.location.href = `/chat?workspaceSlug=${workspaceSlug}`;
                }
            }
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
            setLoading(false);
        }
    };

    const sendUserName = () => {
        const { fullname } = request;
        handleEmailRequestUpdate({ fullname }, ADD_NAME);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { formisValid, errors: formErrors } = ValidateForm(e, request);
        if (formisValid) {
            isNameRequest ? sendUserName() : intiateChatForUser();
        }
        setErrors(formErrors);
    };

    const { email, fullname } = request;

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
                    type={`${isNameRequest ? "text" : "email"}`}
                    placeholder={`${
                        isNameRequest
                            ? "Enter your name"
                            : "Enter your email address"
                    }`}
                    name={`${isNameRequest ? "fullname" : "email"}`}
                    id={`${isNameRequest ? "fullname" : "email"}`}
                    inputClass='py-3 email__input'
                    data-label={`${isNameRequest ? "Name" : "Email address"}`}
                    value={`${isNameRequest ? fullname : email}`}
                    label={`${isNameRequest ? "Full name" : "Email"}`}
                    onChange={handleChange}
                    isErr={isNameRequest ? errors?.fullname : errors?.email}
                    errMssg={isNameRequest ? errors?.fullname : errors?.email}
                    hideLabel={true}
                />
                <Button
                    type='submit'
                    text={"Continue"}
                    classType='primary'
                    otherClass='my-3 w-100 submit__email'
                    loading={loading}
                />
            </form>
            {bottomText && (
                <div className='info__section'>
                    <ReactSVG src={imageLinks.svg.info} />
                    <p>{bottomText}</p>
                </div>
            )}
        </div>
    );
};

export default EmailForm;
