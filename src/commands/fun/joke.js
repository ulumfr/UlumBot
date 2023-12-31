const joke = require("one-liner-joke");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("joke")
        .setDescription("Get a funny joke"),

    async execute(interaction) {
        const { member } = interaction;

        const jokeEmbed = new EmbedBuilder()
            .setDescription(joke.getRandomJoke().body)
            .setColor("#FFAEC9")
            .setTimestamp()
            .setFooter({ text: `Requested by ${member.user.tag}`, iconURL: member.displayAvatarURL() });
            
        return interaction.reply({ embeds: [jokeEmbed] });
    }
};