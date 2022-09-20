export const getErrorMessage = (error) => {
    const response = error?.response;
    const defaultMssg = "Something went wrong. Please try again.";
    const errorMessage =
        response?.status === 503
            ? defaultMssg
            : response?.data
            ? response?.data?.message
            : defaultMssg;

    return errorMessage;
};

export function timeSince(reqDate) {
    //
    let date = new Date(reqDate);
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " yrs";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " m";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hrs";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " mins";
    }
    return Math.floor(seconds) + " s";
}

export const getFormatedDate = (reqDate, getTimeOnly) => {
    let fullDate = new Date(reqDate);
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];

    // const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const year = fullDate.getFullYear(); // 2019
    const date = fullDate.getDate();

    const monthName = months[fullDate.getMonth()];
    // const dayName = days[fullDate.getDay()];
    let hour = fullDate.getHours();

    let minute = fullDate.getMinutes();

    minute = minute < 10 ? `0${minute}` : minute;

    let timePostfix = hour > 12 ? "pm" : "am";

    hour = hour > 12 ? hour - 12 : hour;

    let formattedTime = `${hour}:${minute} ${timePostfix}`;

    let formattedDate = `${date} ${monthName} ${year}`;

    return getTimeOnly
        ? `${formattedTime}`
        : `${formattedDate}, ${formattedTime}`;
};

export const generateID = (length = 10) => {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

export const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()].sort(
        function (a, b) {
            return new Date(a.deliveryDate) - new Date(b.deliveryDate);
        }
    );
};

export const getFileFormat = (fileName) => {
    const splitted = fileName?.split(".");
    return splitted[splitted?.length - 1];
};

export const truncate = (str, len = 50) => {
    if (str?.length > len) {
        return str?.substring(0, len) + "...";
    } else {
        return str;
    }
};

export const convertSecondsToISOString = (seconds) => {
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString();
};

export const validateEmail = (emailAddress="") => {
    let emailTest = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailAddress?.match(emailTest) ? true : false;
};
