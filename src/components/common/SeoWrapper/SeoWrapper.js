import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";


const SeoWrapper = ({ title }) => {
    const { chatSettings: { companyLogo, teamName } } = useSelector(state => state.chat)
    useEffect(() => {
        document.getElementById("favicon").href = companyLogo;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Helmet>
            <title>
                {`${teamName}  ${title ? title : ""}`}
            </title>
        </Helmet>
    )
};


export default SeoWrapper;
