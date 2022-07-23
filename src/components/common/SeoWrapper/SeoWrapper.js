import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";


const SeoWrapper = ({ title }) => {
    const { chatSettings: { companyLogo, teamName } } = useSelector(state => state.chat)

    return (
        <Helmet>
            <title>
                {`${teamName} - ${title}`}
            </title>
            <link rel='icon' href={companyLogo} sizes="16x16" />
        </Helmet>
    )
};


export default SeoWrapper;
