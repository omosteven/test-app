import React, { useEffect } from "react";
import $ from 'jquery';
import 'malihu-custom-scrollbar-plugin';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
require('jquery-mousewheel');

export const SmothScrollContentHorizontal = ({ children, activeElement, className, tag, ID, selector, extraProps }) => {

    // const Tag = ({ label, children, ...props }) => React.createElement((label ? label : "div"), props, children)

    const loopDuration = 2000; 
    const _autoScroll = (to) => {
        try {
            if (to) {
                $(`${selector}`).mCustomScrollbar("scrollTo", to, { scrollInertia: loopDuration / 2, easing: "easeInOutSmooth" });
            }
        } catch (err) {
            
        }

    }

    const runOnClient = (func) => {
        if (typeof window !== "undefined") {
            if (window.document.readyState === "loading") {
                window.addEventListener("load", func);
            } else {
                func();
            }
        }
    };

    const smoothScrollEffect = () => {
        try {
            $(`${selector}`).mCustomScrollbar({
                theme: "minimal-dark",
                callbacks: {//
                    onInit: function () {
                        setTimeout(function () {
                            if (activeElement) {
                                runOnClient(() => _autoScroll(`#${activeElement}`));
                            }

                        }, 1000);
                    }
                    // onTotalScroll:function(){
                    //   if($(this).data("mCS").trigger==="external"){
                    //     _autoScroll("left");
                    //   }
                    // },
                    // onTotalScrollBack:function(){
                    //   if($(this).data("mCS").trigger==="external" && totalLoops){
                    //     _autoScroll("right");
                    //     totalLoops--
                    //   }
                    // }
                },
                ...extraProps
            });
        } catch (error) {
            

        }

    }

    useEffect(() => {
        runOnClient(() => smoothScrollEffect())
        if (activeElement) {
            runOnClient(() => _autoScroll(`#${activeElement}`));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeElement])

    return (
        <div
            // label={div}
            className={className}
            id={`${ID}`}>
            {children}
        </div>
    )
}
