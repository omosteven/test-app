import { getFormatedDate } from "../../../../../../../../utils/helper";

const MessageTimeStatus = ({ date, statusText }) => {
    return (
        <>
            <span className='read-time'>
                {date && `${statusText} ${getFormatedDate(date)}`}
            </span>
        </>
    );
};

export default MessageTimeStatus;
