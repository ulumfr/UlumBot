const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../../config/config.json");
const axios = require("axios");

//LINK : https://rapidapi.com/ajith/api/qr-code-generator-with-multiple-datatypes-
module.exports = {
    data: new SlashCommandBuilder()
        .setName("qrcode")
        .setDescription("Create a QR CODE (URL)")
        .addStringOption(option => option
            .setName("url")
            .setDescription("The URL for the qr code")
            .setRequired(true)
        ),
    
    async execute(interaction){
        await interaction.deferReply();
        const url = interaction.options.getString('url');
        const key = config.RAPIDAPI;
        const input = {
            method: 'GET',
            url: 'https://codzz-qr-cods.p.rapidapi.com/getQrcode',
            params: {
                type: 'url',
                value: url
            },
            headers: {
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'codzz-qr-cods.p.rapidapi.com'
            }
        };
          
        try {
            const output = await axios.request(input);

            const qrEmbed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setTitle(`QR CODE`)
                .setImage(output.data.url)
                .setFooter({ text: "QRCODE Generate" })
                .setTimestamp()

            await interaction.editReply({ embeds: [qrEmbed] })
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'URL NOT VALID!!', ephemeral: true})
        }
    }
}