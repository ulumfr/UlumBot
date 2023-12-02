const { SlashCommandBuilder, EmbedBuilder, version } = require("discord.js");
const { connection } = require("mongoose");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Receive information regarding the bot."),

    async execute(interaction, client) {
        await interaction.deferReply();

        const status = [
            "Disconnected",
            "Connected",
            "Connecting",
            "Disconnecting"
        ];

        await client.user.fetch();
        await client.application.fetch();

        const getChannelTypeSize = type => client.channels.cache.filter(channel => type.includes(channel.type)).size;

        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24
        const minutes = Math.floor(client.uptime / 60000) % 60
        const seconds = Math.floor(client.uptime / 1000) % 60

        let uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const botinfoEmbed = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setTitle(`Information & Statistics`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .addFields(
                { name: ":robot: Client", value: client.user.tag, inline: false },
                { name: "<:ActiveDeveloper:1134785935423324232> Developer", value: `${client.application.owner.tag || "None"}`, inline: false },
                { name: ":calendar: Created", value: `27-07-2023`, inline: false },
                { name: "<a:timer:1123960449914900603> Uptime", value: `${uptime}`, inline: false },
                { name: ":signal_strength: Latency", value: `${client.ws.ping}ms`, inline: false },
                { name: ":bar_chart: Database", value: status[connection.readyState], inline: false },
                { name: "<:Nodejs:1180516606024106054> Node.js", value: process.version, inline: false },
                // { name: "<:djs:1123961072639029338> Discord.js", value: version, inline: false },
                { name: "<:SlashCommands:1134785890238091385> Commands", value: `${client.commands.size}`, inline: false },
                { name: "<:Server:1180517744542752828> Servers", value: `${client.guilds.cache.size}`, inline: false },
                { name: ":busts_in_silhouette: Users", value: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, inline: false }
            )

        await interaction.editReply({embeds: [botinfoEmbed] });
        await wait(20000);
        await interaction.deleteReply();
    }
};