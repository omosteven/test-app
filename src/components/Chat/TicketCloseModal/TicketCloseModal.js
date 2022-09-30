import { useState } from "react";
import ConfirmCloseChatModal from "../ConfirmCloseChatModal/ConfirmCloseChatModal";
import TicketCloseRatingModal from "../TicketCloseRatingModal/TicketCloseRatingModal";

const ticketCloseStages = {
    CONFIRMATION: "CONFIRMATION",
    RATING: "RATING",
};

const TicketCloseModal = ({
    showModal,
    closeModal,
    referenceData,
    handleTicketCloseSuccess,
}) => {
    const [stage, setStage] = useState(ticketCloseStages.CONFIRMATION);

    const handleSuccess = () => {
        setStage(ticketCloseStages.RATING);
    };

    const handleCloseRating = () => {
        closeModal();
        handleTicketCloseSuccess();
    };

    const renderBasedOnStage = () => {
        switch (stage) {
            case ticketCloseStages.CONFIRMATION:
                return (
                    <ConfirmCloseChatModal
                        show={showModal}
                        toggle={() => closeModal()}
                        referenceData={referenceData}
                        handleSuccess={handleSuccess}
                    />
                );
            case ticketCloseStages.RATING:
                return (
                    <TicketCloseRatingModal
                        show={showModal}
                        toggle={() => handleCloseRating()}
                        referenceData={referenceData}
                        handleSuccess={handleTicketCloseSuccess}
                    />
                );
            default:
                return "";
        }
    };

    return <>{renderBasedOnStage()}</>;
};

export default TicketCloseModal;
