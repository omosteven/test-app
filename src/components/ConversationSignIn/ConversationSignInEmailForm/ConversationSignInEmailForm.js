import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import queryString from "query-string";
import { Button, Input } from "components/ui";
import { getErrorMessage } from "utils/helper";
import { setActiveTicket } from "store/tickets/actions";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import pushToDashboard from "components/SignInForm/actions";
import ValidateForm from "utils/validations/validator";
import { ErrorDialog } from "components/ui";

const ConversationSignInEmailForm = ({ handleEmailRequestUpdate }) => {
    const { workspaceId } = useSelector((state) => state.chat.chatSettings);
    const [request, setRequest] = useState({
        email: "",
        workspaceId,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMssg, setErrorMssg] = useState("");

    const params = queryString.parse(window.location.search);
    const conversationId = params?.conversationId;

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequest({ ...request, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const engageConversation = async () => {
        try {
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

                return window.location.reload();
            }
        } catch (err) {
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

                if (data?.userToken) {
                    pushToDashboard(data);

                    if (conversationId) {
                        engageConversation();
                    }

                    window.location.reload();
                } else {
                    handleEmailRequestUpdate({ email, sessionId: data });
                }
            }
        } catch (err) {
            setLoading(false);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { formisValid, errors: formErrors } = ValidateForm(e, request);
        if (formisValid) {
            validateUser();
        }
        setErrors(formErrors);
    };

    const { email } = request;

    return (
        <div>
            <h5 className='signin-header'>Hi there!</h5>
            <p className='signin-sub__text'>
                Enter your email address so we can continue
            </p>
            <form onSubmit={handleSubmit}>
                <ErrorDialog
                    show={Boolean(errorMssg)}
                    message={errorMssg}
                    hide={() => setErrorMssg()}
                />
                <Input
                    type='email'
                    placeholder='Enter your email address'
                    name='email'
                    id='email'
                    inputClass='py-3 email__input'
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
                    otherClass='my-3 w-100 submit__email'
                    loading={loading}
                />
            </form>
        </div>
    );
};

export default ConversationSignInEmailForm;
