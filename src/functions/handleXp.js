const { getXPForLevel } = require("../data");
const { User } = require("../schemas/user")

const levelRoles = {
    5: "1357766185755873462",
    10: "1357766250851336334",
    25: "1357766309718397180",
    50: "1357766359106322484",
    100: "1357766401628045343" //hardcoded, change this to use ur own level roles.
};

async function assignLevelRoles(message, user) {
    

    const guild = message.guild;
    const discordUserId = String(user.userId);

    try {
        const member = await guild.members.fetch(discordUserId);
        if (!member) return;

        const userRoles = member.roles.cache.map(role => role.id);
        const milestoneLevels = Object.keys(levelRoles).map(Number);

        let currentMilestone;

        for(milestone in levelRoles){
            if(user.level >= milestone){
                currentMilestone = milestone;
            }
        }

        console.log(Object.keys(levelRoles).find(key => levelRoles[key] === levelRoles[currentMilestone]))

        if(userRoles.includes(levelRoles[currentMilestone])){
            return;
        } else {
            await removeLevelRoles(message.member)
            await member.roles.add(levelRoles[currentMilestone])
        }

    } catch (error) {
        console.log("Failed to update member roles:", error);
    }
}
async function removeLevelRoles(member){
    const userRoles = member.roles.cache.map(role => role.id)

    for(milestone in levelRoles){
        if(userRoles.includes(levelRoles[milestone])){
            await member.roles.remove(levelRoles[milestone])
        }
    }
}

async function handleXp(message) {

    // xp stuff

    // Fetch user data from the database or create a new user if not exists
    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
        // Create a new user with default xp and level values
        user = new User({
            userId: message.author.id,
            xp: 0,
            level: 1,
            totalXp: 0,
            lastXPTime: Date.now(),
            xpMultiplier: 1,
            messagesWithMultiplier: 0,
            balance: 1000,
            lastGotRobbedTime: 0,
            lastTimeRobbedSomeone: 0,
            lastDailyClaim: 0,
            lastWorkedTime: 0
        });

    }

    const currentTime = Date.now();
    const timeDifference = currentTime - user.lastXPTime;

    // Set the cooldown time (for testing, you can set it to 0)
    const XP_COOLDOWN = 10 * 1000; // 10 seconds cooldown between XP rewards

    // If the cooldown has passed, award XP
    if (timeDifference >= XP_COOLDOWN) {
        // Award XP (random number between 10-25 * multiplier)
        const awardedXP = (Math.floor(Math.random() * 15) + 10) * user.xpMultiplier;
        user.xp += awardedXP;
        user.totalXp += awardedXP;

        // Update the lastXPTime to the current time
        user.lastXPTime = currentTime;

        // Check if the user has leveled up
        const xpToLevelUp = getXPForLevel(user.level);

        while (user.xp >= xpToLevelUp) {
            user.level++;
            user.xp = user.xp - xpToLevelUp; // set xp to remaining xp

            // Send a message when the user levels up
            message.reply(`Congratulations ${message.author.username}! You have leveled up to level ${user.level}!`);

            assignLevelRoles(message, user)
        }

        // If the user has used their multiplier messages, reset it
        if (user.messagesWithMultiplier > 0) {
            user.messagesWithMultiplier--;
            if (user.messagesWithMultiplier === 0) {
                user.xpMultiplier = 1; // Reset to no multiplier
            }
        }
    } else {
        // If the cooldown hasn't passed, you can optionally inform the user
        const timeLeft = Math.floor((XP_COOLDOWN - timeDifference) / 1000);
    }


    await user.save()
}

module.exports = {
    handleXp
}