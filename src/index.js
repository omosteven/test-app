import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import store from "./store/store";
import AppTemplateWrapper from "hoc/AppTemplateWrapper/AppTemplateWrapper";
import "./assets/scss/_index.scss";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <AppTemplateWrapper>
                <App />
            </AppTemplateWrapper>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
