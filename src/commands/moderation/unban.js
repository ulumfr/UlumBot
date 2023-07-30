const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the discord server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option
            .setName("userid")
            .setDescription("Discord ID of the user you want to unban.")
            .setRequired(true)
        ),

    async execute(interaction) {

        const userId = interaction.options.getString("userid");

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setDescription(`Succesfully unbanned id **${userId}** from the server`)
                .setColor("#FFAEC9")
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`Please provide a valid member's ID.`)
                .setColor("#FFAEC9");

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}