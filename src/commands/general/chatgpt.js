const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const config = require("../../../config/config.json");

const configuration = new Configuration({
    apiKey: config.OPENAIAPI
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('(NO API = NO READY) Ask chatgpt a question!')
        .addStringOption(option => option
            .setName('question')
            .setDescription('This is going to be the question for chatgpt')
            .setRequired(true)
        ),

        async execute(interaction){
            await interaction.deferReply();

            const question = interaction.options.getString('question');

            try{
                const res = await openai.createCompletion({
                    model: 'text-davinci-003',
                    max_tokens: 2048,
                    temperature: 0.5,
                    prompt: question
                })
                
                const gptEmbed = new EmbedBuilder()
                    .setColor("#FFAEC9")
                    .setDescription(`\`\`\`${res.data.choices[0].text}\`\`\``)
                
                await interaction.editReply({ embeds: [gptEmbed] });
            } catch(e){
                const errEmbed = new EmbedBuilder()
                    .setColor("#FFAEC9")
                    .setDescription(`Request Failed`)
                
                await interaction.editReply({ embeds: [errEmbed], ephemeral: true });
            }
        }
}
