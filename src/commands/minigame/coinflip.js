const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flip a coin."),

    async execute(interaction) {
        const embedd = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setImage("https://media.discordapp.net/attachments/1083650198850523156/1084439687495700551/img_7541.gif?width=1600&height=1200");

        await interaction.reply({ embeds: [embedd], fetchReply: true });

        setTimeout(() => {
            const choices = ["Angka", "Gambar"];
            const randomChoice = choices[Math.floor(Math.random() * choices.length)];

            const emoji =
                randomChoice === "Angka"
                ? "⓿"
                : "🪙";

            const embed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setTitle("Hasil Coin")
                .addFields(
                    {name: " ", value: `${emoji}  ${randomChoice}`},
                    {name: "Requested by:", value: `<@${interaction.user.id}>`}
                )
                .setFooter({ text: `Coin Flipped`})

            interaction.editReply({ embeds: [embed] });
        }, 1000);
    },
};