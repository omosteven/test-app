import { ErrorDialog } from "components/ui";
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt";
import CustomRatings from "components/ui/CustomRatings/CustomRatings";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { useState } from "react";
import { getErrorMessage } from "utils/helper";
import Modal from "../../common/Modal/Modal";
import "./TicketCloseRatingModal.scss";

const TicketCloseRatingModal = ({
    show,
    toggle,
    referenceData,
    handleSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [ratingValue, setRatingValue] = useState(0);

    const rateTicket = async () => {
        try {
            const { ticketId } = referenceData;
            setErrorMsg("");
            setLoading(true);

            const url = apiRoutes?.rateTicket(ticketId);
            const res = await API.put(url, {
                rating: ratingValue / 20,
            });
            if (res.status === 200) {
                handleSuccess();
            }
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
            setLoading(false);
        }
    };
    return (
        <Modal
            {...{
                show,
                toggle,
            }}
            otherClassNames='ticket-closure-modal'>
            <div>
                <ErrorDialog
                    show={Boolean(errorMsg)}
                    message={errorMsg}
                    hide={() => setErrorMsg()}
                />
                <ConfirmPrompt
                    handleCancel={toggle}
                    handleConfirmation={rateTicket}
                    subTitle={`Kindly give a few minutes of your time to rate your experience. Thank you.`}
                    loading={loading}
                    actionBtnText='Rate'
                    cancelBtnText='Skip'
                    content={
                        <div className='ticket-closure-modal__rating'>
                            <CustomRatings
                                rating={ratingValue}
                                handleRating={(value) => setRatingValue(value)}
                            />
                        </div>
                    }
                />
            </div>
        </Modal>
    );
};

export default TicketCloseRatingModal;
