const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const welcomeSchema = require("../../models/welcome");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Setup and Disable your welcome messages.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(command => command
            .setName('setup')
            .setDescription('Setup for welcome messages')
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Channel for welcome messages.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("welcome-message")
                .setDescription("Enter your welcome messages.")
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName("welcome-role")
                .setDescription("Enter your welcome role.")
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('disable')
            .setDescription('Disabled welcome messages')
        ),
        

    async execute(interaction){
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            const no3Embed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setDescription(`I don't have permissions for this`)
            await interaction.reply({ embeds: [no3Embed], ephemeral: true });
        }
        const data = await welcomeSchema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand([ "setup", "disable" ]);

        switch (sub) {
            case 'setup':
                if(data) {
                    const noEmbed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`Welcome messages is already setup in database`)
                    await interaction.reply({ embeds: [noEmbed], ephemeral: true });
                 }else{
                    const welcomeChannel = interaction.options.getChannel('channel');
                    const welcomeMessage = interaction.options.getString('welcome-message');
                    const roleId = interaction.options.getRole('welcome-role');

                    await welcomeSchema.create({
                        Guild: interaction.guild.id,
                        Channel: welcomeChannel.id,
                        Msg: welcomeMessage,
                        Role: roleId.id,
                    });

                    const wmEmbed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`Successfully created a welcome messages`)
                    
                    await interaction.reply({ embeds: [wmEmbed]});
                }
                break;
            case 'disable':
                if(!data){
                    const no2Embed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`You dont have setup welcome messages!`)
                    await interaction.reply({ embeds: [no2Embed], ephemeral: true });
                }else{
                    const disableEmbed = new EmbedBuilder()
                        .setColor("FFAEC9")
                        .setDescription("Setup welcome messages has been **DISABLED**")
                    
                    await welcomeSchema.deleteOne({ Guild: interaction.guild.id });
                    await interaction.reply({ embeds: [disableEmbed] });
                }   
                break;
        }
    }
}