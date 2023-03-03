import { useState } from "react";
// import MediaDisplayError from "./MediaDisplayError/MediaDisplayError";
import MediaDisplayLoader from "./MediaDisplayLoader/MediaDisplayLoader";

const mediaTypes = {
    VIDEO: "VIDEO",
    FILE: "FILE",
    IMAGE: "IMAGE",
};

const MediaDisplay = ({
    mediaType,
    isTablet,
    mobileDimension,
    desktopDimension,
    ...rest
}) => {
    const [mediaIsLoaded, setMediaIsLoaded] = useState(false);
    // const [mediaError, setMediaError] = useState(false);

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
                            alt={'Branch Image'}
                            // onError={() => setMediaError(true)}
                            alt='branch instruction'
                        />
                        {!mediaIsLoaded && (
                            <MediaDisplayLoader
                                isTablet={isTablet}
                                mobileDimension={mobileDimension}
                                desktopDimension={desktopDimension}
                            />
                        )}
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
                        {!mediaIsLoaded && (
                            <MediaDisplayLoader
                                isTablet={isTablet}
                                mobileDimension={mobileDimension}
                                desktopDimension={desktopDimension}
                            />
                        )}
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
