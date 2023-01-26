import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import AppTemplateWrapper from "hoc/AppTemplateWrapper/AppTemplateWrapper";
import FaviconNotificationContextProvider from "react-favicon-notification";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/scss/_index.scss";
import "react-datepicker/dist/react-datepicker.css";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <FaviconNotificationContextProvider>
                <AppTemplateWrapper>
                    <App />
                </AppTemplateWrapper>
            </FaviconNotificationContextProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
