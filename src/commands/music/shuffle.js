const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../../server");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle current playlist."),
    async execute(interaction) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("#FFAEC9").setDescription("You must be in a voice channel to execute music commands.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("#FFAEC9").setDescription(`You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {

            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor("#FFAEC9").setDescription("There is no active queue.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await queue.shuffle();
            embed.setColor("#FFAEC9").setDescription(`🎶 Shuffled songs in the queue.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            embed.setColor("#FFAEC9").setDescription("⛔ | Something went wrong...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}