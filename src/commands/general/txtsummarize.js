const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../../config/config.json");
const axios = require("axios");

//LINK : https://rapidapi.com/OpenedAI/api/gpt-summarization
module.exports = {
    data: new SlashCommandBuilder()
        .setName("txtsummarize")
        .setDescription("Summaraize Text")
        .addStringOption(option => option
            .setName("text")
            .setDescription("The text to summarize")
            .setRequired(true)
        ),
    
    async execute(interaction){
        await interaction.deferReply();
        const text = interaction.options.getString('text');
        const key = config.RAPIDAPI;

        const input = {
            method: 'POST',
            url: 'https://gpt-summarization.p.rapidapi.com/summarize',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'gpt-summarization.p.rapidapi.com'
            },
            data: {
                text: text,
                num_sentences: 3
            }
        };
        
        try {
            const output = await axios.request(input);

            const summEmbed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setTitle(`📖 Summarize Text 📖`)
                .setDescription(output.data.summary)
                .setFooter({ text: "Summarize Generate" })
                .setTimestamp()

            await interaction.editReply({ embeds: [summEmbed] })
        } catch (error) {
            console.log(error);
            await interaction.editReply({ content: "Error! "});
        }
    }
}