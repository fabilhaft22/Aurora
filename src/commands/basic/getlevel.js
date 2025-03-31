const {SlashCommandBuilder} = require("discord.js")
const {getLevel} = require("../../functions/getLevel")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription("check a user´s level")
        .addUserOption(option => option.setName('user').setDescription("the user to check the level of")),
    async execute(interaction) {
        let target = interaction.options.getUser('user')
        if(!target) target = interaction.member
        getLevel(interaction, target)
    }
}