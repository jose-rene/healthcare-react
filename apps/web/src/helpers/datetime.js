import dayjs from "dayjs";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const advancedFormat = require("dayjs/plugin/advancedFormat");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

export const fromUtc = (date, tz = "") => {
    return `${dayjs
        .utc(date, "MM/DD/YYYY hh:mm:ss")
        .local()
        .format("ddd MM/DD/YYYY h:mm A")}${tz ? ` ${tz}` : ""}`;
};

export const fromUtcDate = (date, formatType = "YYYY-MM-DD") => {
    return dayjs.utc(date, "MM/DD/YYYY hh:mm:ss").local().format(formatType);
};
export const fromUtcTime = (date, tz = "") => {
    return `${dayjs
        .utc(date, "MM/DD/YYYY hh:mm:ss")
        .local()
        .format("hh:mm A")}${tz ? ` ${tz}` : ""}`;
};

export const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
};

export const formatTime = (date) => {
    return dayjs(date, "HH:mm").format("HH:mm");
};

export const getTimes = (start_time, length, duration) => {
    const times = [{ value: "", text: "" }];

    let today = dayjs(
        `${dayjs().format("YYYYMMDD")}${start_time}`,
        "YYYYMMDDHH:mm"
    );

    for (let i = 0; i < length; i++) {
        times.push({
            id: i,
            value: today.format("HH:mm"),
            title: today.format("LT"),
        });
        today = today.add(duration, "minutes");
    }
    return times;
};
