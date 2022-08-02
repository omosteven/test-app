import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../../../assets/images";
import { IMAGE, PDF, VIDEO } from "../enum";
import { dataQueryStatus } from "../../../../../../../utils/formatHandlers";
import "./UploadPreview.scss";

const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const UploadPreview = ({
    uploadPreview,
    status,
    uploadType,
    handleRemoveFile,
    handleRetry,
}) => {
    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.remove}
                        className='upload__preview--icon'
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
                        src={imageLinks?.svg?.leftArrow}
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
                    />
                );
            case PDF:
                return <p>{uploadPreview}</p>;
            case VIDEO:
                return (
                    <div className='upload__preview--media__container'>
                        <video className='upload__preview--media'>
                            <source src={uploadPreview} />
                        </video>
                        <ReactSVG
                            src={imageLinks?.svg?.remove}
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
                    />
                );
        }
    };

    return (
        <>
            {uploadPreview && (
                <div className='upload__preview'>
                    {renderBasedOnStatus()}
                    {renderBasedOnUploadType()}
                </div>
            )}
        </>
    );
};

export default UploadPreview;
