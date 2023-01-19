import imageLinks from "assets/images";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import { dataQueryStatus } from "utils/formatHandlers";

const { LOADING, DATAMODE } = dataQueryStatus;

const UploadedFileIcon = ({
    fileAttachmentName,
    fileIndex,
    status,
    handleRemoveFile,
}) => {
    const [isCancellable, updateIsCancellable] = useState(false);

    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <div
                        onMouseEnter={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            updateIsCancellable(true);
                        }}
                        onMouseLeave={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            updateIsCancellable(false);
                        }}>
                        {!isCancellable ? (
                            <ReactSVG
                                src={imageLinks?.svg?.loading}
                                className='uploaded-file__icon'
                            />
                        ) : (
                            <ReactSVG
                                src={imageLinks?.svg?.remove}
                                className='uploaded-file__icon'
                                onClick={() =>
                                    handleRemoveFile(
                                        fileAttachmentName,
                                        fileIndex
                                    )
                                }
                            />
                        )}
                    </div>
                );
            case DATAMODE:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.cancel}
                        className='uploaded-file__icon'
                        onClick={() =>
                            handleRemoveFile(fileAttachmentName, fileIndex)
                        }
                    />
                );
            default:
                return "";
        }
    };
    return <>{renderBasedOnStatus()}</>;
};

export default UploadedFileIcon;
