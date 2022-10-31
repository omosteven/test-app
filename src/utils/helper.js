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
    date?.setSeconds(seconds);
    return date?.toISOString();
};

export const validateEmail = (emailAddress = "") => {
    let emailTest = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailAddress?.match(emailTest) ? true : false;
};

export const getDaysHrsMinsAndSecs = (noOfSeconds) => {
    let hours = 0;
    let days = 0;
    let mins = 0;
    let secs = 0;

    let totalSeconds = Number(noOfSeconds);

    if (totalSeconds > 86400) {
        let offSeconds = totalSeconds % 86400;
        days = (totalSeconds - offSeconds) / 86400;
        totalSeconds = offSeconds;
    }

    if (totalSeconds < 86400 && totalSeconds >= 3600) {
        let offSeconds = totalSeconds % 3600;
        hours = (totalSeconds - offSeconds) / 3600;
        totalSeconds = offSeconds;
    }

    if (totalSeconds < 3600 && totalSeconds >= 60) {
        let offSeconds = totalSeconds % 60;
        mins = (totalSeconds - offSeconds) / 60;
        totalSeconds = offSeconds;
    }

    secs = totalSeconds;

    return { days, hours, mins, secs, total: noOfSeconds };
};

export const incrementDateTime = (dateTime) => {
    if (dateTime?.length !== 24) {
        return "";
    }
    let updatedMsecs =
        Number.parseInt(dateTime.slice(20, dateTime.length - 1)) + 1;
    return `${dateTime.slice(0, 20)}${updatedMsecs}Z`;
};

export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();

        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

export const cropImage = async (crop, url, setOutput) => {
    const canvas = document.createElement("canvas");
    const image = await createImage(url);

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    // set canvas size to match the bounding box
    canvas.width = image.width;
    canvas.height = image.height;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(image.width / 2, image.height / 2);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // extract the cropped image using these values
    const data = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = crop.width;
    canvas.height = crop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // Converting to base64
    const base64Image = canvas.toDataURL("image/jpeg");

    setOutput(base64Image);
};

export const getCurrentFormInputRules = (rules, inputType) => {
    const customRules = {
        number00: "maxLength",
        number01: "max",
    };

    const customPatterns = {
        TEXT: "",
        NUMERIC: "[0-9]d{10}",
        LONG_TEXT: "",
        number00: "",
        number01: "",
    };

    let validationRules = {};
    let pattern = "";
    // [A-Za-z]
    // min,max,minLength,maxLength, minSize,maxSize, isALink, isEmail, minDate,maxDate

    pattern += `\+${customPatterns[inputType]}`;

    for (let i = 0; i < rules?.length; i++) {
        let { baseFormRule, ruleConstraint, ...rest } = rules[i];
        let { formElementRuleCode } = baseFormRule;
        let ruleType = customRules[formElementRuleCode];
        validationRules[ruleType] = {
            ruleConstraint,
            baseFormRule,
            ...rest,
        };
    }

    return { ...validationRules, pattern };
};
