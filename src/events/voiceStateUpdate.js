const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {

        const logChannel = newState.guild.channels.cache.get(process.env.voiceLogChannel)

        const member = newState.guild.members.cache.get(newState.id)
        let channel;
        //console.log(newState)
        //previously not in a channel so joined a channel now
        if (oldState.channelId === null) {
            channel = oldState.guild.channels.cache.get(newState.channelId)
            const embed = new EmbedBuilder()
                .setTitle(`Member joined a voice channel`)
                .setAuthor({
                    name: member.user.username,
                    iconURL: member.displayAvatarURL()
                })
                .addFields({ name: "", value: `**${member.user.username}** joined ${channel.name}` })
                .setColor("Green")
                .setFooter({
                    text: `ID: ${member.id}`
                })
                .setTimestamp(Date.now())

            logChannel.send({ embeds: [embed] })
        }

        //previously in a channel but left channel now
        else if (newState.channelId === null) {
            channel = newState.guild.channels.cache.get(oldState.channelId)
            const embed = new EmbedBuilder()
                .setTitle(`Member left a voice channel`)
                .setAuthor({
                    name: member.user.username,
                    iconURL: member.displayAvatarURL()
                })
                .addFields({ name: "", value: `**${member.user.username}** left ${channel.name}` })
                .setColor("Red")
                .setFooter({
                    text: `ID: ${member.id}`
                })
                .setTimestamp(Date.now())

            logChannel.send({ embeds: [embed] })
        }
    }
}