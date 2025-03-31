async function convertTime(time){
    let timeInt = parseInt(time);
    let intLength = `${timeInt}`;

    if (isNaN(timeInt)) return 0;

    let suffix = time.slice(intLength.length, time.length).toLowerCase(); // FIXED

    switch (suffix) {
        case "s": 
        case "sec":
        case "seconds":
            return timeInt;
        case "m":
        case "min":
        case "minutes":
            return minutesToSeconds(timeInt);
        case "h":
        case "hr":
        case "hrs":
        case "hours":
            return hoursToSeconds(timeInt);
        case "d":
        case "day":
        case "days":
            return daysToSeconds(timeInt);
        case "w":
        case "weeks":
            return weeksToSeconds(timeInt);
        case "mon":
        case "months":
            return monthsToSeconds(timeInt);
        case "y":
        case "yrs":
        case "years":
            return yearsToSeconds(timeInt);
        default:
            return 0;
    }
}


function minutesToSeconds(time){
    return (time * 60);
}

function hoursToSeconds(time){
    return (time * 60 * 60);
}

function daysToSeconds(time){
    return (time * 60 * 60 * 24);
}

function weeksToSeconds(time){
    return (time * 60 * 60 * 24 * 7)
}

function monthsToSeconds(time){
    return (time * 60 * 60 * 24 * 30)
}

function yearsToSeconds(time) {
    return (time * 60 * 60 * 24 * 365)
}

//formats an integer of seconds into a more readable string of minutes
function formatTime(seconds) {
    if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;

    const units = [
        { label: "year", value: 60 * 60 * 24 * 365 },
        { label: "month", value: 60 * 60 * 24 * 30 },
        { label: "week", value: 60 * 60 * 24 * 7 },
        { label: "day", value: 60 * 60 * 24 },
        { label: "hour", value: 60 * 60 },
        { label: "minute", value: 60 },
    ];

    let result = [];

    for (const unit of units) {
        const amount = Math.floor(seconds / unit.value);
        if (amount > 0) {
            result.push(`${amount} ${unit.label}${amount > 1 ? "s" : ""}`);
            seconds %= unit.value;
        }
    }

    return result.join(" and ");
}

module.exports = {
    convertTime,
    formatTime
}