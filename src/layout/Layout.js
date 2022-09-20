import React, { cloneElement } from "react";
import FadeIn from "../components/ui/FadeIn";
import { useLocation } from "react-router-dom";
import SeoWrapper from "../components/common/SeoWrapper/SeoWrapper";
import ToastContextProvider from "../components/common/Toast/context/ToastContextProvider";
import "./Layout.scss";

export default function Layout({ children }) {
    let location = useLocation();
   
    return (
        <>
            <ToastContextProvider>
                <SeoWrapper />
                <FadeIn location={location.pathname}>
                    <main className='home'>
                        <div className='page'>{cloneElement(children)}</div>
                    </main>
                </FadeIn>
            </ToastContextProvider>
        </>
    );
}
