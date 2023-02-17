import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import queryString from "query-string";
import Layout from "./layout/Layout";
import { getErrorMessage } from "./utils/helper";
import API from "./lib/api";
import apiRoutes from "./lib/api/apiRoutes";
import FullPageLoader from "./components/common/FullPageLoader/FullPageLoader";
import { updateChatSettings } from "./store/chat/actions";
import store from "./store/store";
import PublicRoute from "./routes/PublicRoute/PublicRoute";
import SignInForm from "./components/SignInForm/SignInForm";
import Chat from "./components/Chat/Chat";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import { defaultThemes, defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import "./App.scss";

const { DARK_MODE_DEFAULT, WHITE_MODE_DEFAULT } = defaultThemes;
const { RELAXED, WORK_MODE } = defaultTemplates;

const App = () => {
    const [fetching, sayFetching] = useState(true);
    const [fetchingError, setFetchingError] = useState();

    const fetchChatSetting = async () => {
        try {
            let params = queryString.parse(window.location.search);
            const workspaceSlug = params?.workspaceSlug;
            setFetchingError();
            sayFetching(true);

            const url = apiRoutes?.chatSettings(workspaceSlug);
            const res = await API.get(url);
            if (res.status === 200) {
                const { data } = res.data;
                const { chatThemeColor, defaultTemplate, defaultTheme } = data;
                const root = document.documentElement;
                store.dispatch(
                    updateChatSettings({
                        ...data,
                        workspaceSlug,
                        defaultTheme,
                        defaultTemplate: WORK_MODE,
                    })
                );
                root.style.setProperty(
                    "--default-primary-color",
                    chatThemeColor
                );
                sayFetching(false);
            }
        } catch (err) {
            sayFetching(false);
            setFetchingError(getErrorMessage(err));
        }
    };

    useEffect(() => {
        fetchChatSetting();
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

                    <PublicRoute path='/*' exact component={SignInForm} />
                </Switch>
            </Layout>
        </Router>
    );
};

export default App;
