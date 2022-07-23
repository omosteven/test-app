import React, { useEffect } from "react";
import $ from 'jquery';
import 'malihu-custom-scrollbar-plugin';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
require('jquery-mousewheel');

export const SmothScrollContentHorizontal = ({ children, activeElement, className, tag, ID, selector, extraProps }) => {

    // const Tag = ({ label, children, ...props }) => React.createElement((label ? label : "div"), props, children)

    const loopDuration = 2000; //loop duration e.g. 7s to right, 7s to left
    // const totalLoops=2; //number

    const _autoScroll = (to) => {
        try {
            if (to) {
                $(`${selector}`).mCustomScrollbar("scrollTo", to, { scrollInertia: loopDuration / 2, easing: "easeInOutSmooth" });
            }
        } catch (err) {
            console.log('error scrolling')
        }

    }

    const runOnClient = (func) => {
        if (typeof window !== "undefined") {
            if (window.document.readyState === "loading") {
                console.log("window is overloding...")
                window.addEventListener("load", func);
            } else {
                func();
            }
        }
    };

    const smoothScrollEffect = () => {
        try {
            console.log('Came to scroll');
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
            console.log(error)

        }

    }

    useEffect(() => {
        runOnClient(() => smoothScrollEffect())
        if (activeElement) {
            runOnClient(() => _autoScroll(`#${activeElement}`));
        }
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


const SmothScrollContentVertical = ({ children, className, tag, ID }) => {

    const _autoScroll = () => {
        try {
            console.log('please auto scroll here')
            // $(`#${ID}`).mCustomScrollbar("scrollTo", 'bottom', {     scrollEasing:"easeOut"        });
            $('#dummy')[0].scrollIntoView({
                behavior: "smooth", // or "auto" or "instant"
                // block: "en" // or "end"
            });
            
            // console.log($('#dummy'));
        } catch (err) {
            console.log('error scrolling')
        }
    }


    const Tag = ({ label, children, ...props }) => React.createElement((label ? label : "div"), props, children)


    const smoothScrollEffect = () => {
        $(`#${ID}`).mCustomScrollbar({
            theme: "minimal-dark",
            callbacks: {//
                onInit: function () {
                    setTimeout(function () {
                        _autoScroll()
                    }, 1000);
                }
            }
        });
    }

    
    useEffect(() => (smoothScrollEffect()))

    // useEffect(() => {
    //     _autoScroll()
    // },[elements])


    return (
        <Tag
            label={tag}
            className={className}
            id={`${ID}`}>
            {children}
        </Tag>
    )
}

export default React.memo(SmothScrollContentVertical, (prevProps, nextProps) => {
    return prevProps?.elements?.length === nextProps?.elements?.length;
});
