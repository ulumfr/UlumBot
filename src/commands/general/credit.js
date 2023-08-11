const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credit')
        .setDescription('BOT BOT BOT.'),

    async execute(interaction, client) {
        const creditEmbed = new EmbedBuilder()
            .setTitle('Ulum Bot')
            .setDescription('Punya Ulum!')
            .setColor("#FFAEC9")
            .setURL(`https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot+applications.commands`)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp()

        await interaction.reply({ embeds: [creditEmbed] });
    }
}