import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import queryString from "query-string";
import Layout from "./layout/Layout";
import { generateID, getErrorMessage } from "./utils/helper";
import API from "./lib/api";
import apiRoutes from "./lib/api/apiRoutes";
import FullPageLoader from "./components/common/FullPageLoader/FullPageLoader";
import {
    setConversationBreakers,
    updateChatSettings,
} from "./store/chat/actions";
import store from "./store/store";
import PublicRoute from "./routes/PublicRoute/PublicRoute";
import SignInForm from "./components/SignInForm/SignInForm";
import Chat from "./components/Chat/Chat";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import ConversationSignIn from "./components/ConversationSignIn/ConversationSignIn";
import { retriveAccessToken } from "storage/sessionStorage";
import {
    getChatSettings,
    storeChatSettings,
    storeConvoBreakers,
} from "storage/localStorage";
import { CONVERSATION_SAVED } from "components/Chat/ChatModule/LiveChat/MessageBody/Messages/enums";
import { isLiveApp } from "config/config";
import "./App.scss";

const App = () => {
    const isAuthenticated = retriveAccessToken();
    const [fetching, setFetching] = useState(true);
    const [fetchingError, setFetchingError] = useState();

    const chatSettings = getChatSettings();

    let params = queryString.parse(window.location.search);

    const setCurrentAppearance = (data) => {
        const root = document.documentElement;

        store.dispatch(
            updateChatSettings({
                ...data,
            })
        );

        root.style.setProperty("--default-primary-color", data?.chatThemeColor);
    };

    const fetchChatSetting = async () => {
        try {
            let params = queryString.parse(window.location.search);
            const workspaceSlug = params?.workspaceSlug;
            setFetchingError();
            setFetching(true);

            const request = isLiveApp
                ? window.location.host.includes("metacare")
                    ? window.location.host?.split(".")[0]
                    : window.location.host
                : workspaceSlug;

            const url = apiRoutes?.chatSettings(request);
            const res = await API.get(url);
            if (res.status === 200) {
                const { data } = res.data;

                const { defaultTemplate, defaultTheme, initialBranch } = data;

                const { actionBranches } = initialBranch || {};

                const saveConvoBreaker = {
                    actionBranchHeader: "Conversation Saved Successfully.",
                    actionBranchId: generateID(),
                    actionBranchMainSentence:
                        "We've sent an email containing a link to your saved conversation",
                    actionBranchOptions: [],
                    actionBranchType: CONVERSATION_SAVED,
                    createdDate: new Date(),
                    updatedDate: new Date(),
                };

                store.dispatch(
                    setConversationBreakers([
                        ...actionBranches,
                        saveConvoBreaker,
                    ])
                );

                storeConvoBreakers(workspaceSlug, [
                    ...actionBranches,
                    saveConvoBreaker,
                ]);

                storeChatSettings({
                    ...data,
                    workspaceSlug,
                    defaultTheme,
                    defaultTemplate,
                });

                setCurrentAppearance({
                    ...data,
                    workspaceSlug,
                    defaultTheme,
                    defaultTemplate,
                });
                setFetching(false);
            }
        } catch (err) {
            setFetching(false);
            setFetchingError(getErrorMessage(err));
        }
    };

    useEffect(() => {
        const { workspaceSlug } = chatSettings || {};
        const queryParsedWorkspaceSlug = params?.workspaceSlug;
        if (
            (workspaceSlug !== params?.workspaceSlug &&
                queryParsedWorkspaceSlug) ||
            !chatSettings
        ) {
            fetchChatSetting();
        } else {
            setCurrentAppearance({
                ...chatSettings,
            });

            setTimeout(() => {
                setFetching(false);
            }, 3000);
        }
        // eslint-disable-next-line
    }, []);

    if (fetching) return <FullPageLoader />;

    if (fetchingError)
        return (
            <div className='fetching__error'>
                {fetchingError}{" "}
                <span
                    onClick={() => fetchChatSetting()}
                    className='fetching__error__retry'>
                    Retry ?
                </span>
            </div>
        );

    return (
        <Router>
            <Layout>
                <Switch>
                    <ProtectedRoute path='/chat' exact component={Chat} />
                    <ProtectedRoute path='/direct' exact component={Chat} />
                    <ProtectedRoute path='/link' exact component={Chat} />
                    <ProtectedRoute path='/ticket' exact component={Chat} />
                    <ProtectedRoute
                        path='/conversation'
                        exact
                        component={isAuthenticated ? Chat : ConversationSignIn}
                    />
                    <PublicRoute path='/*' exact component={SignInForm} />
                </Switch>
            </Layout>
        </Router>
    );
};

export default App;
