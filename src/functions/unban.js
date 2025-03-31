const { PermissionFlagsBits } = require("discord.js");
const { respondRealCallType } = require("./callType");

async function unban(call, target, initiater) {
    // Ensure target is a string (User ID)
    const targetId = typeof target === "string" ? target : target?.id;

    if (!targetId) {
        respondRealCallType(call, "Invalid target provided.");
        return;
    }

    try {
        // Fetch the list of bans
        const bans = await call.guild.bans.fetch();
        
        // Check if the user is actually banned
        if (!bans.has(targetId)) {
            respondRealCallType(call, `User with ID **${targetId}** is not banned.`);
            return;
        }

        // Fetch the ban information
        const banInfo = bans.get(targetId);

        // Unban the user
        await call.guild.bans.remove(targetId);

        respondRealCallType(call, `**${initiater.user.username}** unbanned **${banInfo.user.tag}**.`);
    } catch (error) {
        console.log(error);
        respondRealCallType(call, `Failed to unban user with ID **${targetId}**.`);
    }
}

module.exports = {
    unban
};
