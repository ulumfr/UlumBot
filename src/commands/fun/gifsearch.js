const { SlashCommandBuilder } = require("discord.js");
const superagent = require("superagent");
const config = require("../../../config/config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gifsearch')
        .setDescription('Search for a gif')
        .addStringOption(option => option
            .setName('search')
            .setDescription('What to search for')
            .setRequired(true)
        ),

        async execute(interaction){
            await interaction.deferReply();
            const { options } = interaction;
            const query = options.getString('search');
            const key = config.TENORAPIKEY;
            const clientkey = config.CLIENTTENORKEY;
            const lmt = 10;

            let choice = Math.floor(Math.random() * lmt);
            const link = `https://tenor.googleapis.com/v2/search?q=${query}&key=${key}&client_key=${clientkey}&limit=${lmt}`;
            const output = await superagent.get(link).catch(err => {console.log(err)});

            try{
                await interaction.editReply({ content: output.body.results[choice].itemurl });
            } catch(e){
                return await interaction.editReply({ content: `I could not find a matching gif to \`${query}\`!`});
                
            }
        }
}