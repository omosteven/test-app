import { Modal } from "../../../../ui/Modal/Modal";
import { IMAGE, FILE, VIDEO } from "../LiveChatInput/UploadIcons/enum";
import { getFileFormat } from "../../../../../utils/helper";
import { Button } from "../../../../ui";
import "./ModalPreview.scss";

const ModalPreview = ({
    showModal,
    toggleModal,
    preview,
    previewType,
    fileName,
    sendNewMessage,
    handleRemoveFile,
}) => {
    const renderBasedOnPreviewType = () => {
        switch (previewType) {
            case IMAGE:
                return (
                    <img
                        src={preview}
                        alt='preview'
                        className='preview__media'
                    />
                );
            case FILE:
                return (
                    <div className='preview__file'>
                        {getFileFormat(fileName) === "pdf" ? (
                            <embed
                                type=''
                                src={`${preview}#scrollbar=0&toolbar=0&navpanes=0`}
                                className='preview__file'
                            />
                        ) : (
                            <iframe
                                style={{ width: "900px", height: "900px" }}
                                src='http://docs.google.com/gview?url=https://test-account-service.s3.amazonaws.com/agentInbox/2613476289/887f698d-d883-4bea-9dad-b6ade5696064.vnd.openxmlformats-officedocument.wordprocessingml.document&embedded=true'
                                height='240'
                                width='320'
                                frameborder='0'></iframe>
                        )}
                    </div>
                );
            case VIDEO:
                return (
                    <video className='preview__media' controls>
                        <source src={preview} />
                    </video>
                );
            default:
                return (
                    <img
                        src={preview}
                        alt='preview'
                        className='preview__media'
                    />
                );
        }
    };

    return (
        <Modal show={showModal} close={toggleModal} fullscreen={true}>
            <div className='modal__preview--container'>
                {renderBasedOnPreviewType()}
            </div>
            <div className='custom__modal__footer'>
                <Button text='Cancel' onClick={handleRemoveFile} />
                <Button text='Upload' onClick={sendNewMessage} />
            </div>
        </Modal>
    );
};

export default ModalPreview;
