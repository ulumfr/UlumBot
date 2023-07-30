const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

const languageMap = {
    "auto": "Automatic",
    "sq": "Albanian",
    "ar": "Arabic",
    "zh-tw": "Chinese Traditional",
    "en": "English",
    "tl": "Filipino",
    "de": "German",
    "hi": "Hindi",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "ko": "Korean",
    "la": "Latin",
    "ms": "Malay",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "es": "Spanish",
    "su": "Sundanese",
    "th": "Thai",
    "tr": "Turkish",
    "vi": "Vietnamese",
};

const languageMapFrom = Object.entries(languageMap).slice(0, 25).map(([value, name]) => ({ value, name }));
const languageMapTo = Object.entries(languageMap).slice(0, 25).map(([value, name]) => ({ value, name }));
const languageInfo = {...Object.fromEntries(Object.entries(languageMap).map(([value, name]) => [value, { name }]))};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate your message to a different language (Only 25 Language).')
        .addStringOption(option => option
            .setName('text')
            .setDescription('message input')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('from')
            .setDescription('choose a language to translate from')
            .setRequired(true)
            .addChoices(...languageMapFrom)
        )
        .addStringOption(option => option
            .setName('to')
            .setDescription('choose a language to translate to')
            .setRequired(true)
            .addChoices(...languageMapTo)
        ),
    category: 'Text',
    cooldown: 5000,

    async execute(interaction, client) {
        const msg = interaction.options.getString('text')
        const from = interaction.options.getString('from')
        const to = interaction.options.getString('to')
        const translated = await translate(msg, { from: from, to: to })

        const embed = new EmbedBuilder()
            .setColor("#FFAEC9")
            .setTitle("📝 Translate 📝")
            .setFields(
                { name: `**Inputted ${languageInfo[from].name}**`, value: msg },
                { name: `**Translate to ${languageInfo[to].name}**`, value: translated.text }
            )
            .setFooter({ text: `Google Translate`})
            .setTimestamp()

        interaction.reply({ embeds: [embed] })
    }
}