const {Events, EmbedBuilder} = require("discord.js")

module.exports = {
    name: Events.GuildRoleCreate,
    async execute(role){
        const logChannel = role.guild.channels.cache.get(process.env.serverLogChannel)

        const embed = new EmbedBuilder()
            .setTitle("A new role was created")
            .addFields({
                name: "", value: `**Name:** ${role.name}\n **Color:** ${role.hexColor}\n**Mentionable**: ${role.mentionable}\n**Displayed seperately:** ${role.hoist}`
            })
            .setColor("Gold")
            .setFooter({
                text: `Role ID: ${role.id}`
            })
            .setTimestamp(Date.now())

            logChannel.send({embeds: [embed]})
    }
}