const {SlashCommandBuilder} = require("discord.js")
const { baltop } = require("../../functions/balanceLeaderboard")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('baltop')
        .setDescription("Shows the 10 richest people"),
    async execute(interaction) {
        baltop(interaction)
        return;
    }
}