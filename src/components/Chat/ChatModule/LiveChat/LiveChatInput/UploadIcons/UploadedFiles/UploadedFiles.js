import UploadedFile from "./UploadedFile/UploadedFile";
import "./UploadedFiles.scss";

const UploadedFiles = ({
    uploads,
    handleRemoveFile,
    handleRetry,
    status,
    icon,
}) => {
    return (
        <div className='uploaded-files'>
            {uploads?.map((file, fileIndex) => (
                <UploadedFile
                    key={fileIndex}
                    file={file}
                    fileIndex={fileIndex}
                    handleRemoveFile={handleRemoveFile}
                    status={status}
                    handleRetry={handleRetry}
                    icon={icon}
                />
            ))}
        </div>
    );
};

export default UploadedFiles;
