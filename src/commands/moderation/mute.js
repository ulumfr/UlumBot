const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName('target')
            .setDescription("The member you'd like to mute")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("time")
            .setDescription("The amount of minutes to mute a member for")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("reason")
            .setDescription("The reason for mute the member provided.")
        ),

    async execute(interaction) {
        const { guild, options } = interaction; 
        const user = options.getUser("target");
        const member = guild.members.cache.get(user.id);
        const time = options.getString("time");
        const convertedTime = ms(time);
        const reason = options.getString("reason") || "No Reason Provided";

        const erorrEmbed = new EmbedBuilder()
            .setDescription(`You can't take action on **${user.username}** since they have a higher role.`)
            .setColor("#FFAEC9")
            .setTimestamp();

        const succesEmbed = new EmbedBuilder()
            .setDescription(`Succesfully muted ${user}.`)
            .addFields(
                { name: "Reason", value: `${reason}`, inline: true },
                { name: "Duration", value: `${time}`, inline: true }
            )
            .setColor("#FFAEC9")
            .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [erorrEmbed], ephemeral: true });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [erorrEmbed], ephemeral: true });

        if (!convertedTime)
            return interaction.reply({ embeds: [erorrEmbed], ephemeral: true });

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [succesEmbed], ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    },
};