const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('husbando')
        .setDescription('Generate a random husbando image.'),
  
    async execute(interaction) {
        const res = await fetch('https://nekos.best/api/v2/husbando');
        const img = (await res.json()).results[0].url;

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Husbando!`)
            .setColor('#FFAEC9')
            .setImage(img)
            .setFooter({ text: `Husbando Generated`})
            .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    },
};