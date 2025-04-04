const {SlashCommandBuilder} = require("discord.js")
const { goWork } = require("../../functions/work")

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('work')
        .setDescription("Go work to earn some credits"),
    async execute(interaction) {
        goWork(interaction);
        return;
    }
}