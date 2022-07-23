import React, { cloneElement } from "react";
import FadeIn from "../components/ui/FadeIn";
import { useLocation } from 'react-router-dom';
import SeoWrapper from "../components/common/SeoWrapper/SeoWrapper";

export default function Layout({ children }) {

    let location = useLocation();

    return (
        <>
            <SeoWrapper />
            <FadeIn location={location.pathname}>
                <main className='home'>
                    <div className='page'>
                        {cloneElement(children)}
                    </div>
                </main>
            </FadeIn>
        </>
    );
};
