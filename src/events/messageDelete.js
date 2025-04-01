require("dotenv").config();
const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        try {
            if (message.author.id === process.env.CLIENTID) return;
        } catch (error) {
            console.log("Some error reading message ID (messageDelete.js line 8)");
            return;
        }

        const logChannel = message.guild.channels.cache.get(process.env.messageLogChannel);

        if (!logChannel) {
            console.log("Failed to find log channel (messageDelete.js line 7)");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Message deleted in #${message.channel.name}`)
            .setAuthor({
                name: message.author?.username || "Unknown",
                iconURL: message.author?.displayAvatarURL() || null
            })
            .setFooter({ text: `ID: ${message.author?.id || "Unknown"}` })
            .setTimestamp()
            .setColor("Red");

        let fields = [];

        // Split message content if it's too long
        if (message.content) {
            let contentChunks = splitLongText(message.content, 1024);
            fields.push({ name: "Content", value: contentChunks.shift() });

            // Additional content chunks (if any)
            contentChunks.forEach(chunk => fields.push({ name: " ", value: chunk }));
        }

        // attachments
        if (message.attachments.size > 0) {
            let attachmentLinks = message.attachments.map(att => `[${att.name}](${att.url})`);
            let attachmentChunks = splitLongText(attachmentLinks.join(", "), 1024);

            fields.push({ name: "Attachments", value: attachmentChunks.shift() });

    
            attachmentChunks.forEach(chunk => fields.push({ name: " ", value: chunk }));
        }

        embed.addFields(fields.slice(0, 25));

        logChannel.send({ embeds: [embed] }).catch(console.error);
    }
};

// Function to split long text into chunks of max 1024 characters
function splitLongText(text, maxLength) {
    let chunks = [];
    while (text.length > maxLength) {
        let splitIndex = text.lastIndexOf(" ", maxLength);
        if (splitIndex === -1) splitIndex = maxLength; // Hard split if no space found
        chunks.push(text.slice(0, splitIndex));
        text = text.slice(splitIndex + 1);
    }
    if (text.length > 0) chunks.push(text);
    return chunks;
}
