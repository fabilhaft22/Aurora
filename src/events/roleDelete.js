const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.GuildRoleDelete,
    async execute(role) {
        const logChannel = role.guild.channels.cache.get(process.env.serverLogChannel)

        if(!logChannel) {console.log("Failed to find log channel (roleDelete.js line 6)"); return}

        const embed = new EmbedBuilder()
            .setTitle(`The role "${role.name} was deleted"`)
            .addFields({
                name: "",
                value: `**Name:** ${role.name} 
                **Color:** ${role.hexColor}
                **Mentionable**: ${role.mentionable}
                **Displayed seperately:** ${role.hoist}
                **Position:** ${role.position}
                **Created:** <t:${Math.floor(role.createdAt / 1000)}:R>`
            })
            .setColor("Red")
            .setFooter({
                text: `Role ID: ${role.id}`
            })
            .setTimestamp(Date.now())
        logChannel.send({ embeds: [embed] })
    }
}