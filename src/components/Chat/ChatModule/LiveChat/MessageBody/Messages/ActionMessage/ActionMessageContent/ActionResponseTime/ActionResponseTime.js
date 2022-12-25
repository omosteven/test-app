import { ReactSVG } from "react-svg";
import { getDaysHrsMinsAndSecs } from "utils/helper";
import imageLinks from "assets/images";

import "./ActionResponseTime.scss";

const ActionResponseTime = ({ averageResponseTime }) => {
    const { days, hours, mins, secs } =
        getDaysHrsMinsAndSecs(averageResponseTime);
    return (
        <>
            <div className='action-response-time'>
                <ReactSVG
                    src={imageLinks?.svg?.clock}
                    className='response__time__clock'
                />{" "}
                <span>
                    Replies usually under{" "}
                    {!averageResponseTime ? (
                        "10mins"
                    ) : (
                        <>
                            {" "}
                            {days > 0 && `${days}days`}{" "}
                            {hours > 0 && `${hours}hours`}{" "}
                            {mins > 0 && `${mins}mins`}{" "}
                            {secs > 0 && `${secs}secs`}
                        </>
                    )}
                </span>
            </div>
        </>
    );
};

export default ActionResponseTime;
