const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { loadEvents } = require("./src/handlers/eventHandler");
const { loadCommands } = require("./src/handlers/commandHandler");
const { updateActivity } = require("./src/handlers/activityHandler");

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();
client.events = new Collection();
client.config = require("./config/config.json");

client.login(client.config.TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
    updateActivity(client);
    setInterval(() => updateActivity(client), 10000);
}).catch((err) => console.log(err));    