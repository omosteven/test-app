import moment from "moment";

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

export const isDeviceMobileTablet = () => {
    var check = false;

    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator?.userAgent || navigator?.vendor || window?.opera);
    return check;
};

export const localeDate = (date) => {
    return moment(date).format("L");
};

export const getDateAndMonth = (reqDate) => {
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

    const date = fullDate.getDate();

    const month = months[fullDate.getMonth()];

    return {
        date,
        month,
    };
};
