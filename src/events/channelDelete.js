const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        const logChannel = channel.guild.channels.cache.get(process.env.serverLogChannel)
        let category;

        if(channel.parent !== null) category = channel.parent.name;
        else category = "none"
        if (channel.isVoiceBased()) {
            const embed = new EmbedBuilder()
                .setTitle("Voice channel deleted")
                .addFields({
                    name: "",
                    value: `
                    **Name:** ${channel.name}
                    **Category:** ${category}`
                })
                .setColor("Red")
                .setFooter({
                    text: `Channel ID: ${channel.id}`
                })
                .setTimestamp(Date.now())
            return logChannel.send({ embeds: [embed] })
        }
        else if (channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle("Text channel deleted")
                .addFields({
                    name: "",
                    value: `
                    **Name:** ${channel.name}
                    **Category:** ${category}`
                })
                .setColor("Red")
                .setFooter({
                    text: `Channel ID: ${channel.id}`
                })
                .setTimestamp(Date.now())
            return logChannel.send({ embeds: [embed] })
        }
        //if all of these are true, its a category
        else if (!channel.isThread() && !channel.isThreadOnly() && !channel.isSendable() && !channel.isDMBased() && channel.parent === null) {
            const embed = new EmbedBuilder()
                .setTitle("Category deleted")
                .addFields({
                    name: "",
                    value: `
                    **Name:** ${channel.name}`
                })
                .setColor("Red")
                .setFooter({
                    text: `Category ID: ${channel.id}`
                })
                .setTimestamp(Date.now())
            return logChannel.send({ embeds: [embed] })
        }
    }
}