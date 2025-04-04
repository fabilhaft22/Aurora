const { User } = require("../schemas/user");
const { respondRealCallType } = require("./callType");

async function robTarget(call, target) {
    const victim = await User.findOne({ userId: target });
    const user = await User.findOne({ userId: call.member.id });
    const victimDcUser = call.client.users.cache.get(target);

    if (Date.now() - victim.lastGotRobbedTime <= 3600000) {
        return respondRealCallType(call, `${victimDcUser.username} has been robbed very recently. Let them chill for a bit.`);
    }

    if (Date.now() - user.lastTimeRobbedSomeone <= 1800000) {
        return respondRealCallType(call, `You have already robbed someone very recently. Let the heat cool off first.`);
    }

    if (victim.balance <= 1000) {
        return respondRealCallType(call, `${victimDcUser.username} has less than 1000 credits on their account right now. It's not worth stealing from them.`);
    }

    const randomNumber = Math.floor(Math.random() * 10);
    if (randomNumber < 2) { // 20% failure chance
        const loss = Math.floor(Math.random() * 450 + 300);
        user.balance -= loss;
        await user.save();
        return respondRealCallType(call, `You failed to rob ${victimDcUser.username} and have to pay a bail of ${loss} credits.`);
    }

    // Successful robbery
    const gain = Math.floor(Math.random() * 550 + 250);
    user.balance += gain;
    user.lastTimeRobbedSomeone = Date.now();
    victim.balance -= gain;
    victim.lastGotRobbedTime = Date.now();
    await user.save();
    await victim.save();

    return respondRealCallType(call, `You have successfully stolen ${gain} credits from ${victimDcUser.username}.`);
}

module.exports = { robTarget };
