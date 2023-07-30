const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const leaveSchema = require("../../models/leave");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Setup your leave messages.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(command => command
            .setName('setup')
            .setDescription('Setup for leave messages')
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Channel for leave messages.")
                .setRequired(true)
            )
            .addStringOption(option => option   
                .setName("leave-message")
                .setDescription("Enter your leave messages.")
                .setRequired(true)
            ),
        )
        .addSubcommand(command => command
            .setName('disable')
            .setDescription('Disabled leave messages')
        ),
        

    async execute(interaction){
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            const no3Embed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setDescription(`I don't have permissions for this`)
            await interaction.reply({ embeds: [no3Embed], ephemeral: true });
        }

        const data = await leaveSchema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand([ "setup", "disable" ]);

        switch (sub) {
            case 'setup':
                if(data) {
                    const noEmbed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`Leave messages is already setup in database`)
                    await interaction.reply({ embeds: [noEmbed], ephemeral: true });
                 }else{
                    const leaveChannel = interaction.options.getChannel('channel');
                    const leaveMessage = interaction.options.getString("leave-message");

                    await leaveSchema.create({
                        Guild: interaction.guild.id,
                        Channel: leaveChannel.id,
                        Msg: leaveMessage,
                    });

                    const lmEmbed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`Successfully created a leave messages`)
                    
                    await interaction.reply({ embeds: [lmEmbed] });
                }
                break;
            case 'disable':
                if(!data){
                    const no2Embed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`You dont have setup leave messages!`)
                        
                    await interaction.reply({ embeds: [no2Embed], ephemeral: true });
                }else{
                    const disableEmbed = new EmbedBuilder()
                        .setColor("FFAEC9")
                        .setDescription("Setup leave messages has been **DISABLED**")
                    
                    await leaveSchema.deleteOne({ Guild: interaction.guild.id });
                    await interaction.reply({ embeds: [disableEmbed] });
                }   
                break;
        }
    }
}