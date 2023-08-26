const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Client, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Check the bot's latency.`),
    
    async execute(interaction, client) {
        const icon = interaction.user.displayAvatarURL();
        const tag = interaction.user.tag;

        /**
        * @param {Client} client 
        */
        const embed = new EmbedBuilder()
            .setTitle('**🏓 Pong!**')
            .setDescription(`**\`📡 LATENCY: ${client.ws.ping}ms \`**`)
            .setColor("#FFAEC9")
            .setFooter({ text: `Requested by ${tag}`, iconURL: icon })
            .setTimestamp()

        const refreshButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('refreshButton')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔁')
        )

        const msg = await interaction.reply({ embeds: [embed], components: [refreshButton] })

        const collector = msg.createMessageComponentCollector()
            collector.on('collect', 
                async i => {
                    if(i.customId == 'refreshButton') {
                        i.update({ embeds: [embed], components: [refreshButton] })
                    }
                }
            )
    }
}