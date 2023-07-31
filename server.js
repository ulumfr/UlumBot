const { Client, GatewayIntentBits, Partials, Collection, Events } = require("discord.js");
const { loadEvents } = require("./src/handlers/eventHandler");
const { loadCommands } = require("./src/handlers/commandHandler");
const { updateActivity } = require("./src/handlers/activityHandler");
const { handlevoicejoin } = require("./src/handlers/joinvoiceHandler");
const { handlevoiceleave } = require("./src/handlers/leavevoiceHandler");

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates ],
    partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();
client.events = new Collection();
client.config = require("./config/config.json");

client.on(Events.VoiceStateUpdate, async(oldState, newState) =>{
    handlevoicejoin(oldState, newState);
    handlevoiceleave(oldState, newState);
})

client.login(client.config.TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
    updateActivity(client);
    setInterval(() => updateActivity(client), 10000);
}).catch((err) => console.log(err));    
