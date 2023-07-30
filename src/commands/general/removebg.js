const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require("../../../config/config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removebg")
        .setDescription("Remove a background from an image")
        .addAttachmentOption(option => option
            .setName("image")
            .setDescription("The image you want to remove the background")
            .setRequired(true)
        ),
    
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });
        const image = interaction.options.getAttachment("image");
        const key = config.REMOVEBGAPI;
        const reponse = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                //Saranin pake email temp biar ga membuang credit email utama kita
                'x-api-key': key, //50 free previews via API and apps per month
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                image_url: image.proxyURL,
                size: 'auto'
            })
        });

        const arrayBuffer = await reponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const attachment = new AttachmentBuilder(buffer, { name: 'removebg.png' });
        const removeEmbed = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setTitle(`<:imageremovebgpreview8:1134785916934819930> Remove Background <:imageremovebgpreview8:1134785916934819930>`)
            .setImage("attachment://removebg.png")
            .addFields({ name: "Requested by:", value: `<@${interaction.user.id}>` })
            .setFooter({ text: `Remove Generated`})
            .setTimestamp()

        await interaction.editReply({
            embeds: [removeEmbed],
            files: [attachment],
            ephemeral: true
        })
    }
}