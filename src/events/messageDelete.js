require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if(message.author.id === process.env.CLIENTID) return;

        const logChannel = message.guild.channels.cache.get(process.env.messageLogChannel) //our logging channel
        const embed = new EmbedBuilder()
            .setTitle(`Message deleted in ${message.channel.name}`)
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .addFields(
                { name: "", value: `**content:** ${message.content}` },
                { name: "", value: `Message ID: ${message.id}` }
            )
            .setFooter({
                text: `ID: ${message.author.id}`
            })
            .setTimestamp(Date.now())
            .setColor("Red")

        logChannel.send({ embeds: [embed] })
    }
}