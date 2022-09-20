import { useEffect, useRef, useState } from "react";

import IframeError from "./IframeError/IframeError";
import IframeLoader from "./IframeLoader/IframeLoader";
import IframeView from "./IframeView/IframeView";

import "./Iframe.scss";

const Iframe = ({ src, timeOut = 10000, title }) => {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isLoaded = useRef(false);

    isLoaded.current = false;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoaded?.current) {
                setIsError(false);
            } else {
                setIsError(true);
            }
            setIsLoading(false);
        }, timeOut);

        return () => {
            clearTimeout(timer);
            isLoaded.current = false;
            setIsError(false);
            setIsLoading(false);
        };
    }, []);

    return (
        <>
            <div className='custom-iframe'>
                {isLoading && <IframeLoader />}
                {isError ? (
                    <IframeError />
                ) : (
                    <IframeView
                        src={src}
                        isLoaded={isLoaded}
                        isLoading={isLoading}
                        title={title}
                    />
                )}
            </div>
        </>
    );
};

export default Iframe;
