const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const warningSchema = require("../../models/warning");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Warn users who do not behave according to our community rules.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addSubcommand(subcommand => subcommand
            .setName("add")
            .setDescription("Add a warning to a user.")
            .addUserOption(option => option
                .setName("target")
                .setDescription("Select a user.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("reason")
                .setDescription("Provide a reason.")
            )
            .addStringOption(option => option
                .setName("evidence")
                .setDescription("Provide evidence.")
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("check")
            .setDescription("Check warnings of a user.")
            .addUserOption(option => option
                .setName("target")
                .setDescription("Select a user.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Remove a specific warning from a user.")
            .addUserOption(option => option
                .setName("target")
                .setDescription("Select a user.")
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName("id")
                .setDescription("Provide the warning's id.")
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("clear")
            .setDescription("Clear all warnings from a user.")
            .addUserOption(option => option
                .setName("target")
                .setDescription("Select a user.")
                .setRequired(true)
            )
        ),

    async execute(interaction) {
        const { options, guildId, user, member } = interaction;

        const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
        const target = options.getUser("target");
        const reason = options.getString("reason") || "No reason provided.";
        const evidence = options.getString("evidence") || "None provided.";
        const warnId = options.getInteger("id") - 1;
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        const userTag = `${target.username}#${target.discriminator}`;

        const embed = new EmbedBuilder();

        switch (sub) {
            case "add":
                try {
                    let data = await warningSchema.findOne({ Guild: guildId, UserID: target.id, UserTag: userTag });

                    if (!data) {
                        data = new warningSchema({
                            Guild: guildId,
                            UserID: target.id,
                            UserTag: userTag,
                            Content: [
                                {
                                    ExecuterId: user.id,
                                    ExecuterTag: user.tag,
                                    Reason: reason,
                                    Evidence: evidence,
                                    Date: warnDate
                                }
                            ],
                        });
                    } else {
                        const warnContent = {
                            ExecuterId: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason,
                            Evidence: evidence,
                            Date: warnDate
                        }
                        data.Content.push(warnContent);
                    }
                    data.save();
    
                    if (Object.keys(data.Content).length == 3) {
                        try {
                            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                                embed.setColor("#FFAEC9")
                                    .setDescription(`I would normally kick ${target} because he reached 3 warns, but he's higher than me :(`)
                                    .setFooter({ text: target.tag, iconURL: target.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp();
    
                                return interaction.reply({ embeds: [embed] });
                            } else {
                                await member.kick("Reached maximum of 3 warns.");
    
                                embed.setColor("#FFAEC9")
                                    .setDescription('Reached maximum of 3 warns.')
                                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp();
                                return interaction.reply({ embeds: [embed] });
                            }
    
                        } catch (err) {
                            console.log(err);
                        }
                    } else {
                        embed.setColor("#FFAEC9")
                            .setDescription(`Warning Added: ${userTag} | ||${target.id}|| **Reason**: ${reason} **Evidence**: ${evidence}`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
    
                        interaction.reply({ embeds: [embed] });
                    }
                } catch (error) {
                    console.error(error);
                    interaction.reply({ content: "An error", ephemeral: true });
                }
                break;
                
            case "check":
                try {
                    let data = await warningSchema.findOne({ Guild: guildId, UserID: target.id, UserTag: userTag });

                    if (data) {
                        embed.setColor("#FFAEC9")
                            .setDescription(`${data.Content.map((w, i) =>`**ID**: ${i + 1} **By**: ${w.ExecuterTag} **Date**: ${w.Date} **Reason**: ${w.Reason} **Evidence**: ${w.Evidence}\n\n`)
                            .join(" ")}`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {
                        embed.setColor("#FFAEC9")
                            .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                } catch (error) {
                    console.error(error);
                    interaction.reply({ content: "An error", ephemeral: true });
                }
                break;
                
            case "remove":
                try {
                    let data = await warningSchema.findOne({ Guild: guildId, UserID: target.id, UserTag: userTag });

                    if (data) {
                        data.Content.splice(warnId, 1);
                        data.save();

                        embed.setColor("#FFAEC9")
                            .setDescription(`${userTag}'s warning id: ${warnId + 1} has been removed.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });

                    } else {
                        embed.setColor("#FFAEC9")
                            .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                } catch (error) {
                    console.error(error);
                    interaction.reply({ content: "An error", ephemeral: true });
                }
                break;

            case "clear":
                try {
                    let data = await warningSchema.findOne({ Guild: guildId, UserID: target.id, UserTag: userTag });

                    if (data) {
                        await warningSchema.findOneAndDelete({ Guild: guildId, UserID: target.id, UserTag: userTag });

                        embed.setColor("#FFAEC9")
                            .setDescription(`${userTag}'s warnings were cleared. | ||${target.id}||`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });

                    } else {
                        embed.setColor("#FFAEC9")
                            .setDescription(`${userTag} | ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });
                    }
                } catch (error) {
                    console.error(error);
                    interaction.reply({ content: "An error", ephemeral: true });
                }
                break;
                
        }
    }
}