const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const https = require('https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get random meme.')
        .setDMPermission(true),

    async execute(interaction, client) {
        try {
            //PASTIKAN DNS TIDAK TERBLOCKED PADA SITUS REDDIT
            const agent = new https.Agent({ rejectUnauthorized: false });
            
            const res = await axios.get(`https://reddit.com/r/memes/random/.json`,{
                httpsAgent: agent,
                timeout: 10000,
            });

            const data = res.data[0].data.children[0].data;
            const memeEmbed = new EmbedBuilder()
                .setTitle(`${data.title}`)
                .setURL(`https://reddit.com${data.permalink}`)
                .setImage(`${data.url}`)
                .setColor("#FFAEC9")
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [memeEmbed] });
        } catch (error) {
            await interaction.editReply({ content: 'TRY AGAIN!' });
            console.log(error)
        }
    },
};