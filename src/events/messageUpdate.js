require("dotenv").config()
const {Events, EmbedBuilder} = require("discord.js")

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage){
        const logChannel = newMessage.guild.channels.cache.get(process.env.messageLogChannel) //our logging channel

        if(!logChannel) {console.log("Failed to find log channel (messageUpdate.js line 7)"); return}

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
                text: `ID: ${newMessage.author.id}`
            })
            .setTimestamp(Date.now())

            logChannel.send({embeds: [embed]})

    }
}