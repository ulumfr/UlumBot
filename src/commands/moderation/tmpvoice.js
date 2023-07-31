const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const createvoiceSchema = require('../../models/createvoice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tmpvoice")
        .setDescription("Setup and Disable your join to create voice channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(command => command
            .setName('setup')
            .setDescription('Setup your join to create voice channel')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel you want to be your join to create vc')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
            )
            .addChannelOption(option => option
                .setName('category')
                .setDescription('The category for the new VC to be created')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
            )
            .addIntegerOption(option => option
                .setName('voice-limit')
                .setDescription('Setup the default limit for the new voice')
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(10)
            )
        )
        .addSubcommand(command => command
            .setName('disable')
            .setDescription('Disabled your join to create voice channel')
        ),

    async execute(interaction){
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const no3Embed = new EmbedBuilder()
                .setColor("#FFAEC9")
                .setDescription(`I don't have permissions for this`)
            await interaction.reply({ embeds: [no3Embed], ephemeral: true });
        }

        const data = await createvoiceSchema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand(["setup", "disable"]);

        switch (sub) {
            case 'setup':
                if(data) {
                    const errEmbed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`"You already have a setup systems!"`)
                    
                    await interaction.reply({ embeds: [errEmbed], ephemeral: true });
                 }else{
                    const channel = interaction.options.getChannel('channel');
                    const category = interaction.options.getChannel('category');
                    const limit = interaction.options.getInteger('voice-limit');

                    await createvoiceSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        Category: category.id,
                        VoiceLimit: limit
                    });

                    const cvEmbed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`🔊 The Systems has been setup in ${channel}, all new voice channel will be created in ${category}`)
                    
                    await interaction.reply({ embeds: [cvEmbed] });
                }
                break;
            case 'disable':
                if(!data){
                    const err2Embed = new EmbedBuilder()
                        .setColor("#FFAEC9")
                        .setDescription(`You dont have the join to create systems setup yet!`)
                    
                    await interaction.reply({ embeds: [err2Embed], ephemeral: true });
                }else{
                    const disableEmbed = new EmbedBuilder()
                        .setColor("FFAEC9")
                        .setDescription("🔇 The Systems has been **DISABLED**")
                    
                    await createvoiceSchema.deleteOne({ Guild: interaction.guild.id });
                    await interaction.reply({ embeds: [disableEmbed] });
                }   
                break;
        }

    }
}