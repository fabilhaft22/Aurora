const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const logChannel = member.guild.channels.cache.get(process.env.memberLogChannel);
        const guild = member.guild;

        if (!logChannel) { console.log("failed to find log channel in guildMemberRemove.js(line 6)"); return }

        const roles = member.roles.cache
            .filter(role => role.id !== member.guild.id) // Exclude @everyone role
            .map(role => `<@&${role.id}>`) // Format as mention
            .join(", ") || "No roles"; // Default text if no roles

        // Introduce a short delay to ensure audit logs update
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 1: Check if the user was banned (includes audit logs for reason & executor)
        const fetchedBanLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        });

        const banLog = fetchedBanLogs.entries.first();
        if (banLog) {
            const { target, executor, reason, createdTimestamp } = banLog;

            // Ensure the audit log entry is recent to prevent false positives
            const timeDiff = Date.now() - createdTimestamp;
            if (target.id === member.id && timeDiff < 5000) { // 5s threshold
                const embed = new EmbedBuilder()
                    .setTitle(`${executor.username} banned someone`)
                    .setAuthor({
                        name: member.user.username,
                        icon: member.displayAvatarURL()
                    })
                    .addFields(
                        { name: "The banned user", value: `<@${member.id}>` },
                        { name: "Reason", value: `${reason || "No reason provided."}` },
                        { name: "joined at", value: `<t:${Math.floor(member.joinedAt / 1000)}:R>` },
                        { name: "roles:", value: `${roles}` }
                    )
                    .setColor("Red")
                    .setFooter({
                        text: `ID: ${member.user.id}`
                    })
                    .setTimestamp(Date.now())

                return logChannel.send({ embeds: [embed] })
            }
        }

        // Step 2: Check if the user was kicked
        const fetchedKickLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
        });

        const kickLog = fetchedKickLogs.entries.first();
        if (kickLog) {
            const { target, executor, reason, createdTimestamp } = kickLog;

            const timeDiff = Date.now() - createdTimestamp;
            if (target.id === member.id && timeDiff < 5000) { // 5s threshold
                const embed = new EmbedBuilder()
                    .setTitle(`${executor.username} kicked someone`)
                    .setAuthor({
                        name: member.user.username,
                        icon: member.displayAvatarURL()
                    })
                    .addFields(
                        { name: "The kicked user", value: `<@${member.id}>` },
                        { name: "Reason", value: `${reason || "No reason provided."}` },
                        { name: "joined at", value: `<t:${Math.floor(member.joinedAt / 1000)}:R>` },
                        { name: "roles:", value: `${roles}` }
                    )
                    .setColor("Red")
                    .setFooter({
                        text: `ID: ${member.user.id}`
                    })
                    .setTimestamp(Date.now())

                return logChannel.send({ embeds: [embed] })
            }
        }

        // Step 3: If no ban and no recent kick, assume they left voluntarily
        const embed = new EmbedBuilder()
            .setTitle(`Someone left the server`)
            .setAuthor({
                name: member.user.username,
                icon: member.displayAvatarURL()
            })
            .addFields(
                { name: "User", value: `<@${member.id}>` },
                { name: "joined at", value: `<t:${Math.floor(member.joinedAt / 1000)}:R>` },
                { name: "roles:", value: `${roles}` }
            )
            .setColor("Red")
            .setFooter({
                text: `ID: ${member.user.id}`
            })
            .setTimestamp(Date.now())

        return logChannel.send({ embeds: [embed] })
    }
};
