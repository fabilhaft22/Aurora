require("dotenv").config();
const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.MessageBulkDelete,
    async execute(messages, channel) {
        const logChannel = channel.guild.channels.cache.get(process.env.messageLogChannel);

        if (!logChannel) {
            console.log("Failed to find log channel (messageBulkDelete.js line 7)");
            return;
        }

        let allMessages = [];
        try {
            messages.forEach(message => {
                let messageContent = `**[${message.author?.username || "Unknown"}]:** ${message.content || "*No text*"}\n`;

                if (message.attachments.size > 0) {
                    const attachmentLinks = message.attachments.map(attachment => `[${attachment.name}](${attachment.url})`);

                    // If total attachments exceed 1024 chars, split them into chunks
                    let attachmentChunks = splitLongText(attachmentLinks.join(", "), 1024);
                    messageContent += `**Attachments:** ${attachmentChunks.shift()}\n`;

                    // Store remaining attachment chunks separately
                    attachmentChunks.forEach(chunk => allMessages.push(`**Attachments (contd.):** ${chunk}\n`));
                }

                allMessages.push(messageContent);
            });
        } catch (error) {
            console.error("Error processing messages in bulk delete:", error);
            return;
        }

        // Function to split long text into chunks of max 1024 characters
        function splitLongText(text, maxLength) {
            let chunks = [];
            while (text.length > maxLength) {
                let splitIndex = text.lastIndexOf(", ", maxLength);
                if (splitIndex === -1) splitIndex = maxLength; // Hard split if no good breakpoint
                chunks.push(text.slice(0, splitIndex));
                text = text.slice(splitIndex + 2);
            }
            if (text.length > 0) chunks.push(text);
            return chunks;
        }

        // Function to split messages into multiple fields
        function splitTextIntoFields(textArray) {
            const fields = [];
            let currentChunk = "";

            textArray.forEach(text => {
                if ((currentChunk.length + text.length) > 1024) {
                    if (currentChunk.trim().length > 0) {
                        fields.push({ name: " ", value: currentChunk }); // Invisible field name
                    }
                    currentChunk = "";
                }
                currentChunk += text;
            });

            if (currentChunk.trim().length > 0) {
                fields.push({ name: " ", value: currentChunk }); // Invisible field name
            }
            return fields.slice(0, 25); // Discord allows max 25 fields
        }

        const embed = new EmbedBuilder()
            .setTitle(`${messages.size} Messages Purged in #${channel.name}`)
            .setFooter({ text: `Showing up to ${messages.size} deleted messages` })
            .setTimestamp()
            .setColor("Red");

        // Add split fields, ensuring non-empty values
        const fields = splitTextIntoFields(allMessages);
        if (fields.length === 0) {
            fields.push({ name: " ", value: "No valid message content found." });
        }

        embed.addFields(fields);

        logChannel.send({ embeds: [embed] }).catch(console.error);
    }
};
