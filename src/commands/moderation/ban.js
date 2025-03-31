const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const {ban} = require("../../functions/ban")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("bans a user!")
        .addUserOption(option => option.setName('target').setDescription("The target").setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription("The reason for the ban"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute( interaction ) {
        ban(interaction, interaction.options.getUser('target'), interaction.member, interaction.options.getString('reason'));
    }
        
        
}