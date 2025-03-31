require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
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
                text: message.author.id
            })
            .setTimestamp(Date.now())
            .setColor("Red")

        const logChannel = message.client.channels.cache.get(process.env.messageLogChannel) //our logging channel
        logChannel.send({ embeds: [embed] })
    }
}