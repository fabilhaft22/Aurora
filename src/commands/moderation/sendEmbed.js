const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder, Embed } = require("discord.js")
const {Colors} = require("../../data")
const {makeEmbed} = require("../../functions/makeEmbed")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription("Sends an embed")
        .addStringOption(option => option.setName('title').setDescription("the embeds title"))
        .addStringOption(option => option.setName('fields').setDescription("The fields (content) of the embed. Seperate each field with a ';f' at the end of each section"))
        .addStringOption(option => option.setName('color').setDescription("the embed color").setAutocomplete(true))
        .addStringOption(option => option.setName('description').setDescription("The embed description"))
        .addBooleanOption(option => option.setName('timestamp').setDescription("Set a timestamp"))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async autocomplete(interaction){
        const focussedValue = interaction.options.getFocused();

        // Convert Colors object into an array of { name, value }
        const colorEntries = Object.entries(Colors).map(([name, value]) => ({ name, value }));

        const filtered = colorEntries.filter(color => color.name.toLowerCase().includes(focussedValue.toLowerCase()));

        interaction.respond(filtered.slice(0, 25).map(color => ({
            name: color.name, value: color.name
        })))
    },
    
    async execute(interaction) {
        interaction.reply({embeds: [makeEmbed(
            interaction.options.getString('title'),
            interaction.options.getString('fields'),
            Colors[interaction.options.getString('color')],
            interaction.options.getString('description'),
            interaction.options.getBoolean('timestamp')
        )]})
    }
}