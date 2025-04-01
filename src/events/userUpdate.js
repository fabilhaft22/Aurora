require("dotenv").config();
const { Events, EmbedBuilder } = require("discord.js");

async function findLogChannel(guilds, user) {
    for (const OAuth2Guildguild of guilds.values()) { // ✅ Fix: Use .values() to iterate over Collection
        let guild = user.client.guilds.cache.get(OAuth2Guildguild.id);

        // Fetch the guild if it's not cached
        if (!guild) {
            try {
                guild = await user.client.guilds.fetch(OAuth2Guildguild.id);
            } catch (error) {
                console.error(`Failed to fetch guild: ${OAuth2Guildguild.id}`, error);
                continue; // Skip if fetching fails
            }
        }

        if (!guild) continue; // Ensure guild exists

        const channel = guild.channels.cache.get(process.env.memberLogChannel);
        if (!channel || !channel.isTextBased()) continue; // Ensure channel is a valid text channel

        return channel; // Return immediately when found
    }

    return null; // Return null if no matching channel was found
}

module.exports = {
    name: Events.UserUpdate,
    async execute(oldUser, newUser) {
        const guilds = await newUser.client.guilds.fetch();
        let logChannel = await findLogChannel(guilds, newUser); // ✅ Ensure this is awaited

        if (!logChannel) {
            console.log("Log channel for user logging not found");
            return;
        }

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
                .setColor("Blue");

            logChannel.send({ embeds: [embed] });
        } else if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
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
                .setThumbnail(newUser.displayAvatarURL());

            logChannel.send({ embeds: [embed] });
        }
    }
};
