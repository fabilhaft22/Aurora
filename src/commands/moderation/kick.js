const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const {kick} = require("../../functions/kick")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription("kicks a user!")
        .addUserOption(option => option.setName('target').setDescription("The target").setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription("The reason for the kick"))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute( interaction ) {
        kick(interaction, interaction.options.getUser('target'), interaction.member, interaction.options.getString('reason'));
    }
        
        
}