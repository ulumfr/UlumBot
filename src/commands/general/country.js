const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('country')
        .setDescription('Get Information of a Country')
        .setDMPermission(true)
        .addStringOption(option => option
            .setName('name')
            .setDescription('Country Name')
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({ fetchReply: true }) 
        const country = interaction.options.getString('name')

        try {
            const response = await axios(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`)
            const data = response.data[0]

            const countryEmbed = new EmbedBuilder()
                .setTitle(`${data.name.common}`)
                .setThumbnail(`${data.flags.png}`)
                .addFields(
                    { name: `Official Name`, value: `${data.name.official}`, inline: true },
                    { name: `Continent`, value: `${data.continents.join(', ') || 'N/A'}`, inline: true },
                    { name: `Capital`, value: `${data.capital.join(', ') || 'N/A'}`, inline: true },
                    { name: `Region`, value: `${data.region || 'N/A'}`, inline: true },
                    { name: `Population`, value: `${data.population.toLocaleString() || 'N/A'}`, inline: true },
                    { name: `Area`, value: `${data.area.toLocaleString() || 'N/A'}`, inline: true },
                    { name: `Languages`, value: `${Object.values(data.languages)?.join(', ') || 'N/A'}`, inline: true },
                    { name: `Currencies`, value: `${Object.values(data.currencies).map(currency => `${currency.name} (${currency.symbol})`)?.join(', ') || 'N/A'}`, inline: true },
                    { name: `Timezones`, value: `${Object.values(data.timezones)?.join(', ') || 'N/A'}`, inline: true },
                    { name: `Flag Information`, value: `${data.flags.alt || 'N/A'}`, inline: true },
                )
                .setColor("#FFAEC9")
                .setTimestamp()
                .setFooter({
                    text: `${data.name.common}`,
                    iconURL: `${data.flags.png}`
                })
            await interaction.editReply({ embeds: [countryEmbed] })
        } catch (error) {
            await interaction.editReply({ content: `Their Was An Error While Getting Data From API, Try Again Later`, ephemeral: true })
            await wait(6000)
            await interaction.deleteReply()
        }
    }
}