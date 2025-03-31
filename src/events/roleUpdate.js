const { Events, EmbedBuilder } = require("discord.js");

const pendingUpdates = new Map();

module.exports = {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole) {

        const logChannel = newRole.guild.channels.cache.get(process.env.serverLogChannel);

        const roleId = newRole.id;
        let changes = [];

        // Check for name change
        if (oldRole.name !== newRole.name) {
            changes.push(`**Name:** \`${oldRole.name}\` → \`${newRole.name}\``);
        }

        // Check for color change
        if (oldRole.color !== newRole.color) {
            changes.push(`**Color:** \`#${oldRole.color.toString(16).padStart(6, "0")}\` → \`#${newRole.color.toString(16).padStart(6, "0")}\``);
        }

        // Check if hoist status changed
        if (oldRole.hoist !== newRole.hoist) {
            changes.push(`**Hoist:** \`${oldRole.hoist ? "Yes" : "No"}\` → \`${newRole.hoist ? "Yes" : "No"}\``);
        }

        // Check if mentionable status changed
        if (oldRole.mentionable !== newRole.mentionable) {
            changes.push(`**Mentionable:** \`${oldRole.mentionable ? "Yes" : "No"}\` → \`${newRole.mentionable ? "Yes" : "No"}\``);
        }

        if (changes.length === 0) return;

        if (pendingUpdates.has(roleId)) {
            pendingUpdates.get(roleId).push(...changes);
        } else {
            pendingUpdates.set(roleId, changes);

            setTimeout(() => {
                const combinedChanges = pendingUpdates.get(roleId);
                pendingUpdates.delete(roleId);

                const embed = new EmbedBuilder()
                    .setTitle(`Role "${newRole.name}" updated`)
                    .setDescription(combinedChanges.join("\n"))
                    .setColor("Blue")
                    .setFooter({ text: `Role ID: ${newRole.id}` })
                    .setTimestamp();

                if (logChannel) logChannel.send({ embeds: [embed] });
            }, 500);
        }
    }
};
