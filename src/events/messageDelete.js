require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        try {
            if(message.author.id === process.env.CLIENTID) return;
        } catch (error) {
            console.log("some error reading message id (messageDelete.js line 8)")
            return;
        }
        

        const logChannel = message.guild.channels.cache.get(process.env.messageLogChannel) //our logging channel

        if(!logChannel) {console.log("failed to find log channel(messageDelete.js line 7)"); return}

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