import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../../../assets/images";
import { IMAGE, FILE, VIDEO } from "../enum";
import { dataQueryStatus } from "../../../../../../../utils/formatHandlers";
import { getFileFormat } from "../../../../../../../utils/helper";
import "./UploadPreview.scss";

const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const UploadPreview = ({
    uploadPreview,
    status,
    uploadType,
    handleRemoveFile,
    handleRetry,
    onClick,
    disableClick,
}) => {
    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.loading}
                        className='upload__preview--icon loading'
                        onClick={handleRemoveFile}
                    />
                );
            case DATAMODE:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.remove}
                        className='upload__preview--icon'
                        onClick={handleRemoveFile}
                    />
                );
            default:
                return "";
        }
    };

    const renderBasedOnUploadType = () => {
        switch (uploadType) {
            case IMAGE:
                return (
                    <img
                        src={uploadPreview}
                        alt='upload'
                        className={`upload__preview--media ${
                            disableClick ? `disabled` : ``
                        }`}
                        onClick={onClick}
                    />
                );
            case FILE:
                return (
                    <div
                        className={`upload__preview--document  ${
                            disableClick ? `disabled` : ``
                        }`}
                        onClick={onClick}>
                        <ReactSVG src={imageLinks?.svg?.document} />
                        <div className='details'>
                            <p>{uploadPreview}</p>
                            <span>{getFileFormat(uploadPreview)}</span>
                        </div>
                    </div>
                );
            case VIDEO:
                return (
                    <div
                        className={`upload__preview--media__container  ${
                            disableClick ? `disabled` : ``
                        }`}
                        onClick={onClick}>
                        <video className='upload__preview--media'>
                            <source src={uploadPreview} />
                        </video>
                        <ReactSVG
                            src={imageLinks?.svg?.play}
                            className='play'
                        />
                    </div>
                );
            default:
                return (
                    <img
                        src={uploadPreview}
                        alt='upload'
                        className={`upload__preview--media ${
                            disableClick ? `disabled` : ``
                        }`}
                        onClick={onClick}
                    />
                );
        }
    };

    return (
        <>
            <div className='upload__preview'>
                {renderBasedOnStatus()}
                {renderBasedOnUploadType()}
                {status === ERROR && (
                    <div className='upload__preview--error__group'>
                        <ReactSVG
                            src={imageLinks?.svg?.retry}
                            onClick={handleRetry}
                        />
                        <ReactSVG
                            src={imageLinks?.svg?.abort}
                            onClick={handleRemoveFile}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default UploadPreview;
