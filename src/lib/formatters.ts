export function formatDate(date: Date) {

    interface Months {
        [index: number]: string
    }

    const months: Months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    }

    return `${months[date.getMonth()]} ${date.getDate()}`;
}

export function formatTime(time: Date) {
    let hour = time.getHours();
    const minute = time.getMinutes();
    const amOrPm = hour < 12 ? "am"  : "pm";

    hour = hour > 12 ? hour - 12 : hour;

    if (hour === 0) {
        hour = 12;
    }

    const minuteString = minute < 10 ? `0${minute}` : minute.toString();

    return `${hour}:${minuteString}${amOrPm}`;
}

export function formatDay(date: Date) {

    type Days = {
        [index: number]: string
    }

    const days: Days = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }

    if (formatDateWithYear(date) === formatDateWithYear(new Date())) {
        return "Today";
    }

    return days[date.getDay()];
}

export function formatLogDate(date: Date) {

    interface Months {
        [index: number]: string
    }

    const dateObj = new Date(date);

    const months: Months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    }

    const currentYear = new Date().getFullYear();

    return `${months[dateObj.getMonth()]} ${dateObj.getDate()}${currentYear === dateObj.getFullYear() ? "" : `, ${dateObj.getFullYear()}`}`
}

export function formatDateWithYear(date: Date) {
    interface Months {
        [index: number]: string
    }

    const months: Months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    }

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}