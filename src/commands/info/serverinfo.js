const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get Information'),

    async execute(interaction, client) {
        const { guild } = interaction

        const { createdTimestamp, ownerId, memberCount, emojis, roles, stickers, channels } = guild
        const icon = guild.iconURL() 
        const totEmoji = 'None' || emojis.cache.map(e => e.toString()) 
        const totRoles = 'None' || roles.cache.map(e => e.toString())

        const serverinfoEmbed = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setAuthor({ name: `${guild.name} Info`, iconURL: icon })
            .setThumbnail(icon)
            .addFields(
                { name: `**Server Name**`, value: guild.name, inline: true },
                { name: `**Server ID**`, value: guild.id, inline: true },
                { name: `**Server Owner**`, value: `<@${ownerId}>`, inline: true },
                { name: `**Server Created**`, value: `<t:${parseInt(createdTimestamp / 1000)}:R>`, inline: true },
                { name: `**Members In Server**`, value: `${memberCount}`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: `**Boost Count**`, value: `${guild.premiumSubscriptionCount}`, inline: true },
                { name: `**Boost Tier**`, value: `${guild.premiumTier}`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: `**Emojis In Server**`, value: `${'0' || emojis.cache.size}\nAnimated: ${'0' || emojis.cache.filter(emoji => emoji.animated).size}\nNormal: ${'0' || emojis.cache.filter(emoji => !emoji.animated).size}`, inline: true },            
                { name: `**Emojis**`, value: `${totEmoji}`, inline: true },
                { name: `Stickers In Server`, value: `${'0' || stickers.cache.size}`, inline: true },
                { name: `**Roles In Server**`, value: `${roles.cache.size - 1}`, inline: true },
                { name: `**Roles**`, value: `${totRoles}`, inline: true },
                { name: `**Highest Role**`, value: `${roles.highest}`, inline: true },
            )
            .setFooter({ text: guild.name, iconURL: icon })

        await interaction.deferReply({ fetchReply: true })
        await interaction.editReply({ embeds: [serverinfoEmbed] })
    }
}