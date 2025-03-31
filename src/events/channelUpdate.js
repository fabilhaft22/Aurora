const { Events, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        const logChannel = newChannel.guild.channels.cache.get(process.env.serverLogChannel);



        let changes = [];

        // Check for name change
        if (oldChannel.name !== newChannel.name) {
            changes.push(`**Name:** \`${oldChannel.name}\` → \`${newChannel.name}\``);
        }

        //check for a change in category
        if (oldChannel.parentId !== newChannel.parentId) {
            const oldCategory = oldChannel.parent ? oldChannel.parent.name : "None";
            const newCategory = newChannel.parent ? newChannel.parent.name : "None";

            changes.push(`**Category:** \`${oldCategory}\` → \`${newCategory}\``);
        }

        if (changes.length <= 0) return;

        const embed = new EmbedBuilder()
            .setTitle(`Channel "${newChannel.name}" updated`)
            .setDescription(changes.join("\n"))
            .setColor("Blue")
            .setFooter({ text: `Role ID: ${newChannel.id}` })
            .setTimestamp();

        if (logChannel) logChannel.send({ embeds: [embed] });
    }
}