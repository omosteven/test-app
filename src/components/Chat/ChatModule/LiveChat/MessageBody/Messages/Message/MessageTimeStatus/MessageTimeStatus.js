import { getFormatedDate } from "utils/helper";

const MessageTimeStatus = ({ date }) => {
    return (
        <>
            <span className='read-time'>{getFormatedDate(date, true)}</span>
        </>
    );
};

export default MessageTimeStatus;
