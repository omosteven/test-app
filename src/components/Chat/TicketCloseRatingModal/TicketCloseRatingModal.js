import { Button, ErrorDialog } from "components/ui";
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
            contentClassName='ticket-closure-modal'>
            <div>
                <ErrorDialog
                    show={Boolean(errorMsg)}
                    message={errorMsg}
                    hide={() => setErrorMsg()}
                />

                <p className='ticket-closure-modal__text'>
                    Kindly give a few minutes of your time to rate your
                    experience. Thank you.
                </p>
                <div className='ticket-closure-modal__rating'>
                    <CustomRatings
                        rating={ratingValue}
                        handleRating={(value) => setRatingValue(value)}
                    />
                </div>
                <div id='btnActionGroup'>
                    <Button
                        type='button'
                        text={`Continue`}
                        classType='primary'
                        onClick={rateTicket}
                        loading={loading}
                    />
                    <Button
                        type='button'
                        text='Close'
                        classType='bordered'
                        // otherClass="my-2 w-100"
                        onClick={toggle}
                        disabled={loading}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default TicketCloseRatingModal;
