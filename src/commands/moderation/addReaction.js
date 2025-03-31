const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addreaction')
        .setDescription("adds a reaction to a message")
        .addStringOption(option => option.setName('messageid').setDescription("the message id").setRequired(true))
        .addStringOption(option =>
            option
                .setName('emoji')
                .setDescription('The emoji to react with')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute( interaction ) {
        const emoji = interaction.options.getString('emoji');
        
        // Validate if the input is a valid emoji
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
        if (!emojiRegex.test(emoji)) {
            return interaction.reply({
                content: 'Please provide a valid emoji.',
                ephemeral: true
            });
        }

        
        const message = await interaction.channel.messages.fetch(interaction.options.getString('messageid'))    
        
        console.log(message)
        
        try {
            message.react(emoji)
        } catch (error) {
            console.log(error)
        }
    }
}