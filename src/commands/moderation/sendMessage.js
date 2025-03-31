const {SlashCommandBuilder, PermissionFlagsBits, MessageFlags} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendmessage')
        .setDescription("Sends a message")
        .addStringOption(option => option.setName('text').setDescription("the text").setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('file (image, textfile, etc.)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute( interaction ) {
        const text = interaction.options.getString('text')
        const attachment = interaction.options.getAttachment('file');
        
        if (attachment) {
            // Send back the same attachment
            await interaction.channel.send({
                content: text,
                files: [attachment.url]  // Use the attachment URL to send it back
            });
        } else {
            await interaction.channel.send(text);
        }
    }
}