const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete a specified number of messages from a target or channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("The amount of messages to be deleted.")
            .setRequired(true))
        .addUserOption(option => option
            .setName("target")
            .setDescription("Select a target to delete their messages.")
            .setRequired(false)),

    async execute(interaction){
        const delayClear = await interaction.reply({ content: "Deleted...", ephemeral: true });
        const {channel, options} = interaction;
        const amount = options.getInteger("amount")
        const target = options.getUser("target")

        const messages = await channel.messages.fetch({
            limit: amount + 1,
        });

        const res = new EmbedBuilder().setColor(0xFF91A4);

        if(target){
            let i = 0;
            const filtered = [];

            messages.filter((msg) => {
                if(msg.author.id === target.id && amount > i){
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Successfully deleted ${messages.size} messages from ${target}`);
            });
        }else{
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`Successfully deleted ${messages.size} messages from ${channel}`);
            });
        }
        delayClear.edit({ content: "", embeds: [res] });
    }
};