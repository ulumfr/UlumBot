const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Receive information regarding an user in the server.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to get info on')
        ),

    async execute(interaction) {
        const { options } = interaction;

        await interaction.deferReply();

        let user = options.getUser('user') || interaction.user;
        let member = await interaction.guild.members.fetch(user.id);
        let icon = user.displayAvatarURL();
        const tag = user.tag;

        const flags = user.flags.toArray();
        let badges = [];

        await Promise.all(flags.map (async badge => {
            if (badge === "Staff") badges.push(`<:DiscordStaff:1134785932176932924>`)
            if (badge === "Partner") badges.push(`<:Partner:1134785925990322186>`)
            if (badge === "CertifiedModerator") badges.push(`<:CertifiedModerator:1134785922630701136>`)
            if (badge === "HypeSquadOnlineHouse1") badges.push(`<:Bravery:1134785910966337586>`)
            if (badge === "HypeSquadOnlineHouse2") badges.push(`<:Brilliance:1134785907707367444>`)
            if (badge === "HypeSquadOnlineHouse3") badges.push(`<:Balance:1134785904276418710>`)
            if (badge === "BugHunterLevel1") badges.push(`<:BugHunter1:1134785920445456384>`)
            if (badge === "ActiveDeveloper") badges.push(`<:ActiveDeveloper:1134785935423324232>`)
            if (badge === "VerifiedDeveloper") badges.push(`<:VerifiedBotDeveloper:1134785902166671400>`)
            if (badge === "VerifiedBot") badges.push(`<:VerifiedBot:1134785893656436736>`)
            if (badge === "PremiumEarlySupporter") badges.push(`<:EarlySupporter:1134785898190475355>`)
            if (badge === "HypeSquad") badges.push(`<:Hypesquad:1134785912849567835>`)
        }))
        
        const userData = await fetch(`https://japi.rest/discord/v1/user/${user.id}`);
        const { data } = await userData.json();

        if(data.public_flags_array){
            await Promise.all(data.public_flags_array.map(async badge => {
                if (badge === "NITRO") badges.push(`<:Nitro:1134785887780212796>`)
            }));
        }

        if(user.bot){
            const botfetch = await fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`);
            let json = await botfetch.json();
            let flagsBot = json.flags;

            const gateways = { APPLICATION_COMMAND_BADGE: 1 << 23 };
            const arrayFlags = [];

            for(let i in gateways){
                const bit = gateways[i];
                if((flagsBot & bit) === bit) arrayFlags.push(i);
            };

            if(arrayFlags.includes('APPLICATION_COMMAND_BADGE')){
                badges.push(`<:SlashCommands:1134785890238091385>`)
            };
        };

        if(!user.discriminator || user.discriminator === 0 || tag === `${user.username}#0`){
            badges.push(`<:Knownas:1134785883669803018>`);
        };
            
        const userinfoEmbed = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setAuthor({ name: tag, iconURL: icon })
            .setThumbnail(icon)
            .addFields({ name: "Name", value: `${user}`, inline: false })
            .addFields({ name: "Profile Badges", value: `${badges.join(' ') || '**No Badges Found**'}` })
            .addFields({ name: "Roles", value: `${member.roles.cache.map(r => r).join(' ')}`, inline: false })
            .addFields({ name: "Joined Server", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true })
            .addFields({ name: "Joined Discord", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true })
            .setFooter({ text: `User ID: ${user.id}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [userinfoEmbed] });
    }
};