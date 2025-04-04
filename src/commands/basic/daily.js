const {SlashCommandBuilder} = require("discord.js")
const { claimDaily } = require("../../functions/claimDaily")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription("Claim your free daily credits"),
    async execute(interaction){
        claimDaily(interaction)
        return;
    }
}