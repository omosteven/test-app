import React, { useState, useEffect } from "react";
import {
    IMAGE,
    FILE,
    VIDEO,
} from "components/Chat/ChatModule/LiveChat/LiveChatInput/UploadIcons/enum";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import { getFileFormat, truncate, cropImage } from "utils/helper";
import MessageContent from "../../MessageContent/MessageContent";
import { useWindowSize } from "utils/hooks";
import "./MediaContent.scss";
import MediaDisplay from "./MediaDisplay/MediaDisplay";

const MediaContent = ({ attachment, openPreviewModal, isReceivedMessage }) => {
    const {
        fileAttachmentUrl,
        fileAttachmentType,
        fileAttachmentName,
        fileAttachmentCaption,
        fileAttachmentImageConfig,
    } = attachment || {};

    const { desktopVersion, mobileVersion } = fileAttachmentImageConfig || {};
    const [outPut, setOutput] = useState("");
    const { width } = useWindowSize();
    const [mediaIsLoaded, setMediaIsLoaded] = useState(false);

    const isTablet = width < 768;

    const cropOutImage =
        fileAttachmentImageConfig &&
        Object?.entries(fileAttachmentImageConfig)?.length > 0;

    useEffect(() => {
        if (
            fileAttachmentImageConfig &&
            Object?.entries(fileAttachmentImageConfig)?.length > 0
        ) {
            if (width > 0) {
                cropImage(
                    isTablet ? mobileVersion : desktopVersion,
                    fileAttachmentUrl,
                    setOutput
                );
            }
        }
    }, [isTablet, cropOutImage, width]);

    const renderBasedOnMediaType = () => {
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <>
                        <MediaDisplay
                            src={cropOutImage ? outPut : fileAttachmentUrl}
                            alt='media'
                            className={`content--media img ${
                                isReceivedMessage ? "received" : "sent"
                            } ${isTablet ? "mobile" : "desktop"} ${
                                !cropOutImage ? "img-orientation" : ""
                            }`}
                            style={{
                                display: mediaIsLoaded ? "initial" : "none",
                            }}
                            onClick={() => openPreviewModal(attachment)}
                            mediaType={IMAGE}
                            isTablet={isTablet}
                            mobileDimension={mobileVersion}
                            desktopDimension={desktopVersion}
                        />
                    </>
                );
            case FILE:
                return (
                    <div onClick={() => openPreviewModal(attachment)}>
                        <div className='content--document'>
                            <ReactSVG src={imageLinks?.svg?.document} />
                            <div className='details'>
                                <p>{truncate(fileAttachmentName)}</p>
                                <span>{getFileFormat(fileAttachmentName)}</span>
                            </div>
                        </div>
                        <iframe
                            src={`https://docs.google.com/gview?url=${fileAttachmentUrl}&embedded=true`}
                            width='100%'
                            height='100%'
                            frameborder='1'
                            title='file name'
                            sandbox='allow-modals'></iframe>
                    </div>
                );
            case VIDEO:
                return (
                    <MediaDisplay
                        className={`content--media video  ${
                            isReceivedMessage ? "received" : "sent"
                        }`}
                        controls
                        onClick={() => openPreviewModal(attachment)}
                        src={fileAttachmentUrl}
                        mediaType={VIDEO}
                    />
                    // <video
                    //     className={`content--media video  ${
                    //         isReceivedMessage ? "received" : "sent"
                    //     }`}
                    //     controls
                    //     onClick={() => openPreviewModal(attachment)}>
                    //     <source src={fileAttachmentUrl} />
                    // </video>
                );

            default:
                return "";
        }
    };

    return (
        <>
            {renderBasedOnMediaType()}
            {fileAttachmentCaption &&
                fileAttachmentCaption !== "" &&
                fileAttachmentCaption !== "null" && (
                    <MessageContent
                        isReceivedMessage={true}
                        messageContent={fileAttachmentCaption}
                    />
                )}
        </>
    );
};

export default MediaContent;
