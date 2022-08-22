import { Modal } from "../../../../ui/Modal/Modal";
import { IMAGE, FILE, VIDEO } from "../LiveChatInput/UploadIcons/enum";
import "./ModalPreview.scss";

const ModalPreview = ({
    showModal,
    toggleModal,
    preview,
    previewType,
    fileName,
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
                        <iframe
                            src={`https://docs.google.com/gview?url=${preview}&embedded=true`}
                            width='100%'
                            height='100%'
                            frameBorder='0'
                            title={fileName}
                            sandbox='allow-orientation-lock allow-pointer-lock allow-popups	allow-popups-to-escape-sandbox	allow-presentation	allow-same-origin	allow-scripts	allow-top-navigation allow-top-navigation-by-user-activation'></iframe>
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
        </Modal>
    );
};

export default ModalPreview;
