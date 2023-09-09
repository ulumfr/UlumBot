const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../../config/config.json");
const axios = require("axios");

const language = {
    "en": 'English',
    "id": 'Indonesian',
}
const languageMap = Object.entries(language).slice(0, 2).map(([value, name]) => ({ value, name }));

//LINK : https://rapidapi.com/nishantapps55/api/google-bard1
//DOCS : https://barddocs.nishantapps.in
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bard")
        .setDescription("ASK questions")
        .addStringOption(option => option
            .setName('language')
            .setDescription('choose a language')
            .setRequired(true)
            .addChoices(...languageMap)
        )
        .addStringOption(option => option
            .setName("question")
            .setDescription("The question to ask Bard AI")
            .setRequired(true)
        ),
    
    async execute(interaction){
        await interaction.deferReply();
        const lg = interaction.options.getString('language');
        const ask = interaction.options.getString('question');
        const key = config.RAPIDAPI;
        const psid = config.BARDPSID;
        const input = {
            method: 'GET',
            url: 'https://google-bard1.p.rapidapi.com/',
            headers: {
                text: ask,
                lang: lg,
                psid: psid, //<__Secure-1PSID>
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'google-bard1.p.rapidapi.com'
              }
        };
          
        try {
            const output = await axios.request(input);

            const askEmbed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setDescription(output.data.response)

            await interaction.editReply({ embeds: [askEmbed] })
        } catch (error) {
            console.error(error);
            return await interaction.editReply({ content: 'NOT VALID!!', ephemeral: true})
        }
    }
}