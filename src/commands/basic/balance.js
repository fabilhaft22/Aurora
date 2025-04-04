const {SlashCommandBuilder} = require("discord.js")
const { balance } = require("../../functions/getBalance")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Get your current account balance"),
    async execute(interaction){
        balance(interaction)
        return;
    }
}