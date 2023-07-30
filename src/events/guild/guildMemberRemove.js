const { GuildMember, EmbedBuilder } = require("discord.js");
const Schema = require("../../models/leave");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
    */
    async execute(member) {
        
        try {
            const data = await Schema.findOne({Guild: member.guild.id}).exec();
      
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";

            const { guild } = member;
            const leaveChannel = member.guild.channels.cache.get(channel);

            const leaveEmbed = new EmbedBuilder()
                .setTitle('**👋 BYE BYE 👋**')
                .setDescription(`<@${member.id}> ${Msg} **${guild.name}**`)
                .setColor("#FFAEC9")
                .addFields({
                    name: "Total Member",
                    value: `${guild.memberCount}`,
                })
                .setTimestamp();

            leaveChannel.send({embeds: [leaveEmbed]});
            console.log(`${member.id} Leaving.`);
        } catch (err) {
            console.error(err);
        }
    },
};