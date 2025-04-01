const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel) {
        const logChannel = channel.guild.channels.cache.get(process.env.serverLogChannel)

        let category;

        if(!logChannel) {console.log("Couldnt find logChannel(channelCreate.js line 6"); return;}

        if(channel.parent !== null) category = channel.parent.name;
        else category = "none"
        if (channel.isVoiceBased()) {
            const embed = new EmbedBuilder()
                .setTitle("Voice channel created")
                .addFields({
                    name: "",
                    value: `
                    **Name:** ${channel.name}
                    **Category:** ${category}`
                })
                .setColor("Gold")
                .setFooter({
                    text: `Channel ID: ${channel.id}`
                })
                .setTimestamp(Date.now())
            return logChannel.send({ embeds: [embed] })
        }
        else if (channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle("Text channel created")
                .addFields({
                    name: "",
                    value: `
                    **Name:** ${channel.name}
                    **Category:** ${category}`
                })
                .setColor("Gold")
                .setFooter({
                    text: `Channel ID: ${channel.id}`
                })
                .setTimestamp(Date.now())
            return logChannel.send({ embeds: [embed] })
        }
        //if all of these are true, its a category
        else if (!channel.isThread() && !channel.isThreadOnly() && !channel.isSendable() && !channel.isDMBased() && channel.parent === null) {
            const embed = new EmbedBuilder()
                .setTitle("Category created")
                .addFields({
                    name: "",
                    value: `
                    **Name:** ${channel.name}`
                })
                .setColor("Gold")
                .setFooter({
                    text: `Category ID: ${channel.id}`
                })
                .setTimestamp(Date.now())
            return logChannel.send({ embeds: [embed] })
        }
    }
}