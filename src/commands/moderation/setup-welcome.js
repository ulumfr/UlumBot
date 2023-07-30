const { Message, Client, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const welcomeSchema = require("../../models/welcome");
const { model, Schema } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-welcome")
        .setDescription("Setup your welcome messages.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel for welcome messages.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("welcome-message")
            .setDescription("Enter your welcome messages.")
            .setRequired(true))
        .addRoleOption(option => option
            .setName("welcome-role")
            .setDescription("Enter your welcome role.")
            .setRequired(true)),

    async execute(interaction){
        const { channel, options } = interaction;
        const welcomeChannel = options.getChannel("channel");
        const welcomeMessage = options.getString("welcome-message");
        const roleId = options.getRole("welcome-role");

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: "I don't have permissions for this", ephemeral: true });
            return;
        }

        try {
            const data = await welcomeSchema.findOne({ Guild: interaction.guild.id }).exec();
      
            if (!data) {
                const Welcome = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessage,
                    Role: roleId.id,
                });
                interaction.reply({ content: "Successfully created a welcome messages", ephemeral: true });
            } else {
                interaction.reply({ content: "Welcome messages is already setup in database", ephemeral: true });
            }
        } catch (err) {
            console.error(err);
            interaction.reply({ content: "An error occurred while setting up the welcome messages", ephemeral: true });
        }
    }
}