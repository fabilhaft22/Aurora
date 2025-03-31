const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const {unban} = require("../../functions/unban")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription("unbans a user!")
        .addStringOption(option => option.setName('targetid').setDescription("The target´s ID").setRequired(true).setAutocomplete(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async autocomplete (interaction){
        const focusedValue = interaction.options.getFocused().toLowerCase();

        const bans = await interaction.guild.bans.fetch();

        const filtered = bans.filter(ban => ban.user.username.toLowerCase().includes(focusedValue))

        interaction.respond(filtered.map(ban => ({name: ban.user.username, value: ban.user.id})).slice(0, 25))
    },

    async execute( interaction ) {
        unban(interaction, interaction.options.getString('targetid'), interaction.member);
    }
}