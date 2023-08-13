const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../../config/config.json");
const axios = require("axios");

//LINK : https://rapidapi.com/farolan/api/url-shortener23
module.exports = {
    data: new SlashCommandBuilder()
        .setName("urlshortener")
        .setDescription("Shorten a LINK URL with (url.gbits.me)")
        .addStringOption(option => option
            .setName("link")
            .setDescription("A long URL to shorten")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("alias")
            .setDescription("(Optional) The alias for your short link")
        ),
    
    async execute(interaction){
        await interaction.deferReply();
        const url = interaction.options.getString('link');
        let alias = interaction.options.getString('alias') || '';
        const key = config.RAPIDAPI;

        const input = {
            method: 'POST',
            url: 'https://url-shortener23.p.rapidapi.com/shorten',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'url-shortener23.p.rapidapi.com'
            },
            data: {
                url: url,
                alias: alias
            }
        };
        
        try {
            const output = await axios.request(input);

            const shortEmbed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setDescription(`🔗 Link for \`${url}\` == ${output.data.short_url}`)
                .setFooter({ text: "Link Generate" })
                .setTimestamp()

            await interaction.editReply({ embeds: [shortEmbed] })
        } catch (error) {
            if(error.statusCode === 400){
                return await interaction.editReply({ content: `⚠️ The Alias \`${alias}\` is already in use!`});
            }else{
                return await interaction.editReply({ content: `⚠️ Try Again!`});
            }
        }
    }
}