const {SlashCommandBuilder} = require("discord.js")
const { leaderboard } = require("../../functions/leaderboard")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription("Returns the leaderboard for the highest levels in this server")
        .addIntegerOption(option => option.setName('amount').setDescription("the amount of people listed").setRequired(true).setMinValue(1).setMaxValue(50)),
    async execute(interaction){
        await interaction.deferReply()
        leaderboard(interaction, interaction.options.getInteger('amount'))
    }
}