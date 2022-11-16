import React, { useState, useEffect, useRef } from "react";
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

    const tablet = width > 768;

    useEffect(() => {
        if (
            Object?.entries(fileAttachmentImageConfig)?.length > 0 &&
            width !== 0
        ) {
            cropImage(
                tablet ? desktopVersion : mobileVersion,
                fileAttachmentUrl,
                setOutput
            );
        }
    }, [tablet]);

    const renderBasedOnMediaType = () => {
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <img
                        src={
                            Object?.entries(fileAttachmentImageConfig)?.length >
                            0
                                ? outPut
                                : fileAttachmentUrl
                        }
                        alt='media'
                        className={`content--media img ${
                            isReceivedMessage ? "received" : "sent"
                        } ${tablet ? "desktop" : "mobile"}`}
                        onClick={() => openPreviewModal(attachment)}
                    />
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
                    <video
                        className={`content--media video  ${
                            isReceivedMessage ? "received" : "sent"
                        }`}
                        controls
                        onClick={() => openPreviewModal(attachment)}>
                        <source src={fileAttachmentUrl} />
                    </video>
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
