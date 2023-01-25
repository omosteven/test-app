import { useState } from "react";
import MediaDisplayError from "./MediaDisplayError/MediaDisplayError";
import MediaDisplayLoader from "./MediaDisplayLoader/MediaDisplayLoader";

const mediaTypes = {
    VIDEO: "VIDEO",
    FILE: "FILE",
    IMAGE: "IMAGE",
};

const MediaDisplay = ({ mediaType, ...rest }) => {
    const [mediaIsLoaded, setMediaIsLoaded] = useState(false);
    const [mediaError, setMediaError] = useState(false);

    const { VIDEO, FILE, IMAGE } = mediaTypes;

    const renderBasedOnMediaType = () => {
        switch (mediaType) {
            case IMAGE:
                return (
                    <>
                        <img
                            {...rest}
                            onLoad={() => setMediaIsLoaded(true)}
                            style={{
                                display: mediaIsLoaded ? "initial" : "none",
                            }}
                            onError={() => setMediaError(true)}
                        />
                        <MediaDisplayError />
                        {!mediaIsLoaded && <MediaDisplayLoader />}
                    </>
                );
            case VIDEO:
                return (
                    <>
                        <video
                            {...rest}
                            onLoad={() => setMediaIsLoaded(true)}
                            style={{
                                display: mediaIsLoaded ? "initial" : "none",
                            }}>
                            <source {...rest} />
                        </video>
                        {!mediaIsLoaded && <MediaDisplayLoader />}
                    </>
                );
            case FILE:
                return <></>;
            default:
                return "";
        }
    };

    return (
        <>
            <div>{renderBasedOnMediaType()}</div>
        </>
    );
};

export default MediaDisplay;
