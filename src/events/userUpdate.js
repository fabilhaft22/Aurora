require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.UserUpdate,
    async execute(oldUser, newUser) {
        if (oldUser.username !== newUser.username) {
            const embed = new EmbedBuilder()
                .setTitle("Username changed")
                .setAuthor({
                    name: newUser.username,
                    iconURL: newUser.displayAvatarURL()
                })
                .addFields({ name: "", value: `**Before:** ${oldUser.username}\n**+After:** ${newUser.username}` })
                .setFooter({
                    text: newUser.id
                })
                .setTimestamp(Date.now())
                .setColor("Blue")

            const logChannel = newUser.client.channels.cache.get(process.env.memberLogChannel)
            logChannel.send({ embeds: [embed] })
        }
        else if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
            const embed = new EmbedBuilder()
                .setTitle("Avatar Update")
                .setAuthor({
                    name: newUser.username,
                    iconURL: newUser.displayAvatarURL()
                })
                .addFields({ name: "User", value: `<@${newUser.id}>` })
                .setFooter({
                    text: newUser.id
                })
                .setTimestamp(Date.now())
                .setColor("Blue")
                .setThumbnail(newUser.displayAvatarURL())

            const logChannel = newUser.client.channels.cache.get(process.env.memberLogChannel)
            logChannel.send({ embeds: [embed] })
        }
    }
}