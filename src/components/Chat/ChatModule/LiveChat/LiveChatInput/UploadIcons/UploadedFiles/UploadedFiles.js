import UploadedFile from "./UploadedFile/UploadedFile";
import "./UploadedFiles.scss";

const UploadedFiles = ({ uploads, handleRemoveFile, handleRetry, status }) => {
    console.log({ uploads });
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
                />
            ))}
        </div>
    );
};

export default UploadedFiles;
