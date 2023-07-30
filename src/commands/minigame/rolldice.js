const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName("rolldice")
        .setDescription("Roll a dice."),
 
    async execute (interaction) {
        const lempar = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setImage("https://www.gambaranimasi.org/data/media/710/animasi-bergerak-dadu-0079.gif")
        
        await interaction.reply({ embeds: [lempar], fetchReply: true });

        setTimeout(() => {
            const Nums = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
            const ball = Math.floor(Math.random() * Nums.length);

            const diceEmbed = new EmbedBuilder()
            .setTitle("Hasil Dadu")
            .addFields(
                {name: "Angka:", value: `${ball}`, inline: true},
                {name: "Requested by:", value: `<@${interaction.user.id}>`}
            )
            .setColor("#FFAEC9")
            .setFooter({ text: `Dice Rolled`})
 
            interaction.editReply({ embeds: [diceEmbed] })
        }, 1000);
    }
};