import React, { cloneElement, useEffect } from "react";
import $ from "jquery";
import { subscribe } from "on-screen-keyboard-detector";
import FadeIn from "../components/ui/FadeIn";
import { useLocation } from "react-router-dom";
import SeoWrapper from "../components/common/SeoWrapper/SeoWrapper";
import ToastContextProvider from "../components/common/Toast/context/ToastContextProvider";
import "./Layout.scss";

export default function Layout({ children }) {
    let location = useLocation();
    // const [showKeyboard, setShowKeyboard] = useState(false);

    // window.visualViewport.addEventListener("resize", resizeHandler);

    const resizeHandler = () => {
        // var correctInnerHeight = window.innerHeight;
        const inputGroup = document.getElementById("inputGroup");
        // const docHeight = inputGroup.clientHeight;
        // var offsetTop = ((window).scrollTop() + correctInnerHeight) - docHeight;
        // offsetTop = Math.min(docHeight, offsetTop);
        var w = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
        );
        var h = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        );
        $("html, body").css({ width: w, height: h });
        // inputGroup.style.top = offsetTop;
        // inputGroup.style.bottom = 0;
    };

    useEffect(() => {
        subscribe((visibilityState) => {
            const newStatus = visibilityState === "hidden" ? false : true;
            if (newStatus) {
                document.body.classList.add("keyboard");
                window.scrollTo(100, 100);
            } else {
                document.body.classList.remove("keyboard");
            }
            // setShowKeyboard(newStatus)
        });
        window.visualViewport.addEventListener("resize", resizeHandler);
        window.addEventListener("scroll", resizeHandler);
    }, []);

    // useEffect(() => {

    //     document.addEventListener('DOMContentLoaded', function() {

    //         visibleWindowHeight( function( visibleHeight ) {

    //             console.log("visibleHeight:", visibleHeight);
    //             /*
    //                 ... continue etc etc  ...
    //             */
    //         });

    //     }, !1);
    // }, [])

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
