require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.MessageBulkDelete,
    async execute(messages, channel) {
        const logChannel = messages.first().guild.channels.cache.get(process.env.messageLogChannel) //our logging channel

        if(!logChannel) {console.log("failed to find log channel (messageBulkDelete.js line 7)"); return}

        let field = ""
        try {
            messages.forEach(message => {
                field += `**[${message.author.username}]:** ${message.content}\n`
            });
        } catch (error) {
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${messages.size} Messages purged in ${channel.name}`)
            .addFields({ name: "", value: field })
            .setFooter({
                text: `Showing the ${messages.size} messages that were purged`
            })
            .setTimestamp(Date.now())
            .setColor("Red")

        logChannel.send({ embeds: [embed] })
    }
}