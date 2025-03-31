const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const {purge} = require("../../functions/purge")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription("purge a select amount of messages at once")
        .addIntegerOption(option => option.setName('amount').setDescription("the amount of messages to delete").setRequired(true).setMinValue(0).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply();
        purge(interaction, interaction.channel, interaction.options.getInteger('amount'))
    }
}
