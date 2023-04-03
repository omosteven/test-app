import React, { useEffect } from "react";

export const SmothScrollContentHorizontal = ({
    children,
    selector,
    axis = "x",
    activeElement,
    className,
    parentScrollId,
    trigger,
}) => {
    const smoothScrollEffect = () => {
        let previousTotalHeight = 0;

        let parentScrollContainer = document.getElementById(parentScrollId);
        let scrollContainerElement = document.getElementById(selector);

        for (
            let scrollItemIndex = 0;
            scrollItemIndex < scrollContainerElement?.children?.length;
            scrollItemIndex++
        ) {
            const currentElement =
                scrollContainerElement?.children[scrollItemIndex];
            const isElementActive =
                currentElement?.className?.includes("active");
            if (isElementActive) {
                break;
            }
            if (axis === "y") {
                previousTotalHeight += currentElement.offsetHeight;
            } else {
                previousTotalHeight += currentElement.offsetWidth;
            }
        }

        if (axis === "y") {
            parentScrollContainer.scrollTo({
                top: previousTotalHeight,
                behavior: "smooth",
            });
        } else {
            parentScrollContainer.scrollTo({
                left: previousTotalHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (activeElement && parentScrollId && selector) {
            smoothScrollEffect();
        }
        // eslint-disable-next-line
    }, [activeElement, parentScrollId, selector, trigger]);

    return (
        <div id={selector} className={className}>
            {children}
        </div>
    );
};
