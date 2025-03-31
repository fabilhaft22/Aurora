const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const {timeout} = require("../../functions/timeout")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription("times a user out!")
        .addUserOption(option => option.setName('target').setDescription("The target").setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription("The duration of the timeout").setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription("The reason for the timeout"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute( interaction ) {
        timeout(interaction, interaction.options.getUser('target'), interaction.member, interaction.options.getString('duration'), interaction.options.getString('reason'));
    }
        
        
}