const { Message, Client, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const leaveSchema = require("../../models/leave");
const { model, Schema } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-leave")
        .setDescription("Set up your leave messages.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel for leave messages.")
            .setRequired(true))
        .addStringOption(option => option   
            .setName("leave-message")
            .setDescription("Enter your leave messages.")
            .setRequired(true)),

    async execute(interaction){
        const { channel, options } = interaction;
        const leaveChannel = options.getChannel("channel");
        const leaveMessage = options.getString("leave-message");

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: "I don't have permissions for this", ephemeral: true });
            return;
        }

        try {
            const data = await leaveSchema.findOne({ Guild: interaction.guild.id }).exec();
      
            if (!data) {
                const Leave = await leaveSchema.create({
                    Guild: interaction.guild.id,
                    Channel: leaveChannel.id,
                    Msg: leaveMessage,
                });
                interaction.reply({ content: "Successfully created a leave messages", ephemeral: true });
            } else {
                interaction.reply({ content: "Leave messages is already setup in database", ephemeral: true });
            }
        } catch (err) {
            console.error(err);
            interaction.reply({ content: "An error occurred while setting up the leave messages", ephemeral: true });
        }
    }
}