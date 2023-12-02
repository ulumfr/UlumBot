const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Information about servers.'),

    async execute(interaction) {
        await interaction.deferReply();

        const guildsList = interaction.client.guilds.cache.map(guild => {
            return `- ${guild.name}: ${guild.memberCount} members`;
        }).join('\n');

        const serverListEmbed = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setTitle("List of Servers")
            .setDescription(guildsList)
            .setTimestamp();

        await interaction.editReply({ embeds: [serverListEmbed] });

    }
};