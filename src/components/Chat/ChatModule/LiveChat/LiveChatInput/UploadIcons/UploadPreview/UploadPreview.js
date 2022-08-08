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
}) => {
    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.loading}
                        className='upload__preview--icon loading'
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
            case ERROR:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.retry}
                        className='upload__preview--icon'
                        onClick={handleRetry}
                    />
                );
            default:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.loading}
                        className='upload__preview--icon'
                    />
                );
        }
    };

    const renderBasedOnUploadType = () => {
        switch (uploadType) {
            case IMAGE:
                return (
                    <img
                        src={uploadPreview}
                        alt='upload'
                        className='upload__preview--media'
                        onClick={onClick}
                    />
                );
            case FILE:
                return (
                    <div
                        className='upload__preview--document'
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
                        className='upload__preview--media__container'
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
                        className='upload__preview--media'
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
            </div>
        </>
    );
};

export default UploadPreview;
