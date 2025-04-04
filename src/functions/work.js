const { respondRealCallType } = require("./callType")
const { User } = require("../schemas/user")
const {formatTime} = require("./timeConverter")

async function goWork(call) {
    let user = await User.findOne({ userId: call.member.id });

    const milliSecondsSinceLastWorked = Date.now() - user.lastWorkedTime;

    if (milliSecondsSinceLastWorked > 900000) { //900000 milliseconds = 15 minutes
        const hoursWorked = (Math.random() * 3 + 3) // 3-6 hours

        user.balance += (hoursWorked * 100).toFixed(0); //get rid of the decimal points
        user.lastWorkedTime = Date.now();

        await user.save();
        respondRealCallType(call, `You have worked for ${Math.floor(hoursWorked)} hours and earned ${(hoursWorked * 100).toFixed(0)} credits for your work`)
        return;
    } else {
        respondRealCallType(call, `You have already worked very recently. You can work again in ${formatTime(900 - (milliSecondsSinceLastWorked / 1000))}`)
        return;
    }
}

module.exports = {
    goWork
}