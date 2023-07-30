const { GuildMember, EmbedBuilder } = require("discord.js");
const Schema = require("../../models/welcome");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
    */
    async execute(member) {
        
        try {
            const data = await Schema.findOne({Guild: member.guild.id}).exec();
      
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";
            let Role = data.Role;

            const {user, guild} = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);

            const welcomeEmbed = new EmbedBuilder()
                .setTitle('**🥳 New Member 🥳**')
                .setDescription(`<@${member.id}> ${data.Msg} **${guild.name}**`)
                .setColor("#FFAEC9")
                .addFields({
                    name: "Total Member",
                    value: `${guild.memberCount}`,
                })
                .setTimestamp();

            welcomeChannel.send({embeds: [welcomeEmbed]});
            member.roles.add(data.Role);
            console.log(`${member.id} Joining.`)
        } catch (err) {
            console.error(err);
        }
    },
};