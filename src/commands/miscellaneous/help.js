const { ComponentType, ButtonBuilder, ButtonStyle , EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Learn more regarding the bot and it's features."),
    
    async execute(interaction) {
        const { client } = interaction;

        const emojis = {
            fun: "😎",
            music: "🎵",
            info: "ℹ️",
            moderation: "🛡️",
            general: "🔗",
            minigame: "🎮",
            miscellaneous: "⚙️",
        };

        function getCommand(name) {
            const getCommandID = client.application.commands.cache
                .filter((cmd) => cmd.name === name)
                .map((cmd) => cmd.id);

            return getCommandID;
        }

        const directories = [...new Set(client.commands.map((cmd) => cmd.folder))];

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "There is no description for this command."
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setDescription(`**Ulum Bot** Listed down below are the features that the bot provides. \n`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setAuthor({ name: `${client.user.username}'s Commands`, iconURL: client.user.avatarURL() })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        categories.forEach((category) => {
            embed.addFields({ name: `${emojis[category.directory.toLowerCase() || null]}   ${formatString(category.directory)} Commands`, value: "\n", inline: false });
        });
        
        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("help-menu")
                    .setPlaceholder("Select a Category")
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands from ${cmd.directory} Category.`,
                                emoji: emojis[cmd.directory.toLowerCase() || null],
                            };
                        })
                    )
            ),

            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Ulum Bot Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`hrttps://discod.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot+applications.commands`),
            ),
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
            ephemeral: true
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
            time: 60000, // 1 minute in milliseconds
        });

        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${emojis[directory.toLowerCase() || null]}   ${formatString(directory)} Commands`)
                .setDescription(`A list of all the commands categorized under ${directory}.`)
                .setColor("#FFAEC9")
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `</${cmd.name}:${getCommand(cmd.name)}>`,
                            value: `\`${cmd.description}\``,
                            inline: true,
                        };
                    })
                );

            interaction.update({ embeds: [categoryEmbed], ephemeral: true });
        });

        collector.on("end", (collected, reason) => {
            if (reason === "time") {
                initialMessage.edit({ 
                    components: components(true), 
                    ephemeral: true 
                });
            }
        });
    },
};
