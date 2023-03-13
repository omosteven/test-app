import React, { useState } from "react";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import API from "../../../lib/api";
import apiRoutes from "../../../lib/api/apiRoutes";
import { getErrorMessage } from "../../../utils/helper";
import ValidateForm from "../../../utils/validations/validator";
import { Button, ErrorDialog, Input } from "../../ui";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import pushToDashboard from "../actions";
import { emailFormActions } from "../enum";
import { dataQueryStatus } from "utils/formatHandlers";
import { setActiveTicket } from "store/tickets/actions";
import "./EmailForm.scss";

const { ADD_EMAIL, ADD_NAME } = emailFormActions;
const { ERROR, LOADING, DATAMODE, NULLMODE } = dataQueryStatus;
const EmailForm = ({
    handleEmailRequestUpdate,
    title,
    subTitle,
    bottomText,
    userId,
    isNameRequest,
    // routeToChat,
}) => {
    const {
        chatSettings: { teamName, workspaceId, workspaceSlug },
    } = useSelector((state) => state.chat);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMssg, setErrorMssg] = useState("");
    const [status, setStatus] = useState("");

    const dispatch = useDispatch();
    const history = useHistory();

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

    const engageConversation = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.engageConversation(conversationId);
            const res = await API.get(url);

            if (res.status === 200) {
                const { data } = res.data;

                dispatch(
                    setActiveTicket({
                        ...data,
                    })
                );

                history.push(`/chat?workspaceSlug=${workspaceSlug}`);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const validateUser = async () => {
        try {
            setLoading(true);
            setErrorMssg();

            const { email, workspaceId } = request;

            const url = apiRoutes?.validateUser;
            const res = await API.post(url, {
                workspaceId,
                appUserId: email,
            });

            if (res.status === 201) {
                const { data } = res.data;

                pushToDashboard(data);

                if (conversationId) {
                    engageConversation();
                } else {
                    history.push(`/chat?workspaceSlug=${workspaceSlug}`);
                }
            }
        } catch (err) {
            setLoading(false);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const intiateChatForUser = async () => {
        try {
            setErrorMssg("");
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
            setErrorMssg(getErrorMessage(err));
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
            isNameRequest
                ? sendUserName()
                : userId
                ? intiateChatForUser()
                : validateUser();
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
                    show={Boolean(errorMssg)}
                    message={errorMssg}
                    hide={() => setErrorMssg()}
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
