import Iframe from "components/ui/Iframe/Iframe";
import { Modal } from "../../../../ui/Modal/Modal";
import { IMAGE, FILE, VIDEO } from "../LiveChatInput/UploadIcons/enum";
import Modald from "components/common/Modal/Modal";
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
                    <Iframe
                        src={`https://docs.google.com/gview?url=${preview}&embedded=true`}
                        title={fileName}
                    />
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
        <>
            {/* <Modal show={showModal} close={toggleModal} fullscreen={true}>
            <div className='modal__preview--container'>
                {renderBasedOnPreviewType()}
            </div>
        </Modal> */}
            <Modald show={showModal} toggle={toggleModal} title='dsds'>
                <div className='modal__preview--container'>
                    {renderBasedOnPreviewType()}
                </div>
            </Modald>
        </>
    );
};

export default ModalPreview;
