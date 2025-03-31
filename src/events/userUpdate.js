require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.UserUpdate,
    async execute(oldUser, newUser) {
        const logChannel = newUser.guild.channels.cache.get(process.env.memberLogChannel)

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
                    text: `ID: ${newUser.id}`
                })
                .setTimestamp(Date.now())
                .setColor("Blue")
                .setThumbnail(newUser.displayAvatarURL())

            logChannel.send({ embeds: [embed] })
        }
    }
}