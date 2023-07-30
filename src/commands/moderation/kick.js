const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the discord server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName("target")
            .setDescription("User to be kicked.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for the kick.")
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("target");
        const reason = options.getString("reason") || "No Reason Provided";

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: "I don't have permissions for this", ephemeral: true });
            return;
        }
        
        const member = await interaction.guild.members.fetch(user.id);

        const erorrEmbed = new EmbedBuilder()
            .setDescription(`You can't take action on **${user.username}** since they have a higher role.`)
            .setColor("#FFAEC9")
            .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [erorrEmbed], ephemeral: true });

        await member.kick(reason);

        const kickEmbed = new EmbedBuilder()
            .setDescription(`${user} was kicked from the server with Reason **[${reason}]**`)
            .setColor("#FFAEC9")
            .setTimestamp();

        await interaction.reply({ embeds: [kickEmbed], ephemeral: true });
    }
}