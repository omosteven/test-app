import { getFormatedDate } from "utils/helper";

const MessageTimeStatus = ({ date }) => {
    return (
        <>
            {date && (
                <span className='read-time'>{getFormatedDate(date, true)}</span>
            )}
        </>
    );
};

export default MessageTimeStatus;
