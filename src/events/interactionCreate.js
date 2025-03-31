const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        // Prevent commands from running in DMs
        if (!interaction.inGuild()) {
            return interaction.reply({
                content: "❌ The commands of this bot cannot be used in DMs",
                ephemeral: true // Message only visible to the user
            });
        }

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (interaction.isChatInputCommand()) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isAutocomplete()) {
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`Error in autocomplete for ${interaction.commandName}:`, error);
            }
        }
    }
};
