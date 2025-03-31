require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.MessageBulkDelete,
    async execute(messages, channel) {
        let field = ""
        try {
            messages.forEach(message => {
                field += `**[${message.author.username}]:** ${message.content}\n`
            });
        } catch (error) {
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${messages.size} Messages purged in ${messages.first().channel.name}`)
            .addFields({ name: "", value: field })
            .setFooter({
                text: `Showing the ${messages.size} messages that were purged`
            })
            .setTimestamp(Date.now())
            .setColor("Red")

        const logChannel = messages.first().client.channels.cache.get(process.env.messageLogChannel) //our logging channel
        logChannel.send({ embeds: [embed] })
    }
}