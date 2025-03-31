const { getXPForLevel } = require('../data');
const { User } = require('../schemas/user');
const { respondRealCallType } = require('./callType');
const { EmbedBuilder } = require("discord.js");

async function getLevel(call, target) {
    let user = await User.findOne({ userId: target });

    target = call.client.users.cache.get(target)

    if (!user) {
        respondRealCallType(call, `**${target.username}** does not have any level data yet!`);
        return;
    }

    // Check if getXPForLevel is functioning correctly
    const xpToLevelUp = getXPForLevel(user.level);

    if (isNaN(xpToLevelUp) || xpToLevelUp <= 0) {
        console.error("Invalid XP value returned from getXPForLevel.");
        respondRealCallType(call, "There was an issue with calculating the XP required for your level.");
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle("Level info!")
        .addFields(
            { name: "Level", value: `**Level ${user.level}**` },
            { name: "XP", value: `${user.xp.toString()}/${xpToLevelUp.toString()}` },
            { name: "Total XP", value: user.totalXp.toString() }
        )
        .setColor("Blue")
        .setTimestamp(Date.now());

    try {
        embed.setAuthor({
            name: target.username,
            iconURL: target.displayAvatarURL() // Set the user's avatar as the small icon
        })
    } catch (error) {
        embed.setAuthor({
            name: "Could not find target username"
        })
    }

    call.reply({ embeds: [embed] });
}

module.exports = {
    getLevel
};
