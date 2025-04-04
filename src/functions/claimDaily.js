const {User} = require("../schemas/user")
const { respondRealCallType } = require('./callType');
const { formatTime } = require("./timeConverter");

async function claimDaily(call){
    let user = await User.findOne({ userId: call.member.id });

    const milliSecondsSinceLastClaim = Date.now() - user.lastDailyClaim

    if(milliSecondsSinceLastClaim > 86400000) {//86400000 milliseconds = 1 day
        user.balance += 1000;
        user.lastDailyClaim = Date.now();
        await user.save()
        respondRealCallType(call, "You have succesfully claimed your 1000 credits for today!")
        return;
    }
    else{
        respondRealCallType(call, `You have already claimed your daily credits. You can claim it again in ${formatTime(86400 - (milliSecondsSinceLastClaim/1000))}`)
        return;
    }
}


module.exports = {
    claimDaily
}