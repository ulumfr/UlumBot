const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const createvoiceSchema = require('../../models/createvoice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join-to-create")
        .setDescription("Setup and disable your join to create voice channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(command => command
            .setName('setup')
            .setDescription('Setup your join to create voice channel')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel you want to be your join to create vc')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
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
                    return await interaction.reply({ content: "You already have a setup join to create systems! Do /join-to-create disable to remove it", ephemeral: true });
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
                        .setDescription(`The join to create systems has been setup in ${channel}, all new VC will be created in ${category}`)
                    
                    await interaction.reply({ embeds: [cvEmbed] });
                }
                break;
            case 'disable':
                if(!data){
                    return await interaction.reply({ content: "You dont have the join to create systems setup yet!", ephemeral: true });
                }else{
                    const disableEmbed = new EmbedBuilder()
                        .setColor("FFAEC9")
                        .setDescription("The join to create systems has been **DISABLED**")
                    
                    await createvoiceSchema.deleteOne({ Guild: interaction.guild.id });
                    await interaction.reply({ embeds: [disableEmbed] });
                }   
                break;
        }

    }
}