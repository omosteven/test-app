import React from "react";
import { useSelector } from "react-redux";
import { defaultThemes } from "./enum";
import "./AppTemplateWrapper.scss";

const { WHITE_MODE_DEFAULT } = defaultThemes;

const AppTemplateWrapper = ({ children }) => {
    const { defaultTheme } = useSelector((state) => state?.chat?.chatSettings);

    return (
        <div
            className={`${
                defaultTheme === WHITE_MODE_DEFAULT
                    ? "white-mode-default"
                    : "dark-mode-default"
            }`}>
            {children}
        </div>
    );
};

export default AppTemplateWrapper;
