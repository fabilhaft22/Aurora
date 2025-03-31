const { PermissionFlagsBits } = require("discord.js");
const { respondRealCallType } = require("./callType");

async function ban(call, target, initiater, reason) {
    // Check if the target is a guild member
    let member = await call.guild.members.fetch(target.id).catch(() => null);

    // Check if the user is an actual Discord user (by fetching from API)
    let user = member ? member.user : await call.client.users.fetch(target.id).catch(() => null);
    if (!user) {
        respondRealCallType(call, "Invalid user! Please provide a valid user ID or mention.");
        return;
    }

    // Prevent banning yourself or the bot
    if (initiater.id === user.id) {
        respondRealCallType(call, "You cannot ban yourself!");
        return;
    }
    if (user.id === call.client.user.id) {
        respondRealCallType(call, "I cannot ban myself!");
        return;
    }

    // If the user is in the guild, check role hierarchy
    if (member) {
        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            respondRealCallType(call, `Cannot ban ${user.username} because they have Administrator permissions.`);
            return;
        }

        const targetHighestRole = member.roles.highest;
        const initiaterHighestRole = initiater.roles.highest;
        const botHighestRole = call.guild.members.me.roles.highest;

        if (targetHighestRole.comparePositionTo(botHighestRole) >= 0) {
            respondRealCallType(call, `Cannot ban ${user.username} because their highest role is equal to or higher than mine.`);
            return;
        }
        if (targetHighestRole.comparePositionTo(initiaterHighestRole) >= 0) {
            respondRealCallType(call, `Cannot ban ${user.username} because their highest role is higher than yours.`);
            return;
        }
    }

    if (!reason) reason = "No reason provided!";

    try {
        await call.guild.bans.create(user.id, { reason });
        respondRealCallType(call, `**${initiater.user.username}** banned **${user.username}**. Reason: ${reason}`);
    } catch (error) {
        console.error(error);
        respondRealCallType(call, `Failed to ban **${user.username}**. Make sure I have the correct permissions.`);
    }
}

module.exports = { ban };
