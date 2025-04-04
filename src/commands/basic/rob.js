const {SlashCommandBuilder} = require("discord.js")
const { robTarget } = require("../../functions/rob")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription("rob someone of their precious credits")
        .addUserOption(option => option.setName('victim').setDescription("The victim").setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('victim')
        robTarget(interaction, target.id)
        return;
    }
}