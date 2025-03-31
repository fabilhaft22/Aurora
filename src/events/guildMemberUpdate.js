require("dotenv").config()
const { Events, EmbedBuilder, Collection } = require("discord.js")

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {

        const logChannel = newUser.guild.channels.cache.get(process.env.memberLogChannel)

        if (oldMember.nickname !== newMember.nickname) {
            const embed = new EmbedBuilder()
                .setTitle("Username changed")
                .setAuthor({
                    name: newUser.username,
                    iconURL: newUser.displayAvatarURL()
                })
                .setFooter({
                    text: newUser.id
                })
                .setTimestamp(Date.now())
                .setColor("Blue")

            if (oldMember.nickname === null) embed.addFields({ name: "", value: `**Before:** none\n**+After:** ${newMember.nickname}` })
            else if (newMember.nickname === null) embed.addFields({ name: "", value: `**Before:** ${oldMember.nickname}\n**+After:** none` })
            else embed.addFields({ name: "", value: `**Before:** ${oldMember.nickname}\n**+After:** ${newMember.nickname}` })

            return logChannel.send({ embeds: [embed] })
        }


        const added = new Collection();
        const removed = new Collection();

        // Find added roles (in new but not in old)
        newMember.roles.cache.forEach((role, id) => {
            if (!oldMember.roles.cache.has(id)) {
                added.set(id, role);
            }
        });


        // Find removed roles (in old but not in new)
        oldMember.roles.cache.forEach((role, id) => {
            if (!newMember.roles.cache.has(id)) {
                removed.set(id, role);
            }
        });

        const addedRoles = added
            .filter(role => role.id !== newMember.guild.id) // Exclude @everyone role
            .map(role => `<@&${role.id}>`) // Format as mention
            .join(", ") || "No roles"; // Default text if no roles


        const removedRoles = removed
            .filter(role => role.id !== newMember.guild.id) // Exclude @everyone role
            .map(role => `<@&${role.id}>`) // Format as mention
            .join(", ") || "No roles"; // Default text if no roles

        //roles updated, not only removed or added
        if (added.size > 0 && removed.size > 0) {

            const embed = new EmbedBuilder()
                .setTitle("Roles updated")
                .setAuthor({
                    name: newMember.user.username,
                    iconURL: newMember.displayAvatarURL()
                })
                .addFields(
                    { name: "", value: `**Added:** ${addedRoles}` },
                    { name: "", value: `**Removed:** ${removedRoles}` }
                )
                .setColor("Blue")
                .setFooter({
                    text: `ID: ${newMember.id}`
                })
                .setTimestamp(Date.now())

            return logChannel.send({ embeds: [embed] })
        }
        else if (added.size > 0) {
            const embed = new EmbedBuilder()
                .setTitle("Roles added")
                .setAuthor({
                    name: newMember.user.username,
                    iconURL: newMember.displayAvatarURL()
                })
                .addFields(
                    { name: "", value: `**Added:** ${addedRoles}` }
                )
                .setColor("Blue")
                .setFooter({
                    text: `ID: ${newMember.id}`
                })
                .setTimestamp(Date.now())

            return logChannel.send({ embeds: [embed] })
        }
        else if (removed.size > 0) {
            const embed = new EmbedBuilder()
                .setTitle("Roles removed")
                .setAuthor({
                    name: newMember.user.username,
                    iconURL: newMember.displayAvatarURL()
                })
                .addFields(
                    { name: "", value: `**Removed:** ${removedRoles}` }
                )
                .setColor("Blue")
                .setFooter({
                    text: `ID: ${newMember.id}`
                })
                .setTimestamp(Date.now())

            return logChannel.send({ embeds: [embed] })
        }

    }
}