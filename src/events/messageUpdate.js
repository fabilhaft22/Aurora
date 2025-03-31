require("dotenv").config()
const {Events, EmbedBuilder} = require("discord.js")

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage){

        if(newMessage.author.bot) return;

        const embed = new EmbedBuilder()
            .setTitle(`Message edited in #${newMessage.channel.name}`)
            .setURL(newMessage.url)
            .setAuthor({
                name: newMessage.author.username,
                iconURL: newMessage.author.displayAvatarURL()
            })
            .addFields({
                name: "", value: `**Before:** ${oldMessage.content}\n**+After:** ${newMessage.content}`
            })
            .setColor("Blue")
            .setFooter({
                text: newMessage.author.id
            })
            .setTimestamp(Date.now())

            const logChannel = newMessage.client.channels.cache.get(process.env.messageLogChannel) //our logging channel
            logChannel.send({embeds: [embed]})

    }
}