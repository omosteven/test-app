import React, { cloneElement } from "react";
import FadeIn from "../components/ui/FadeIn";
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {

    let location = useLocation();

    return (
        <>
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
