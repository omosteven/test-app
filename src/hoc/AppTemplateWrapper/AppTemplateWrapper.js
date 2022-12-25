import React from "react";
import { useSelector } from "react-redux";
import { defaultThemes, defaultTemplates } from "./enum";
import "./AppTemplateWrapper.scss";

const { WHITE_MODE_DEFAULT } = defaultThemes;
const { WORK_MODE } = defaultTemplates;

const AppTemplateWrapper = ({ children }) => {
    const { defaultTheme, defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    return (
        <div
            className={`${
                defaultTheme === WHITE_MODE_DEFAULT
                    ? "white-mode-default"
                    : "dark-mode-default"
            } ${defaultTemplate === WORK_MODE ? "work-mode" : "relaxed-mode"}`}>
            {children}
        </div>
    );
};

export default AppTemplateWrapper;
