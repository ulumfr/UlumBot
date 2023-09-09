const { ActivityType } = require("discord.js");

let isBotStatusEnabled = false;

function getRandomActivity(client) {
    const activityOptions = [
        {
            name: `Music SOON!!!`,
            type: ActivityType.Listening,
        }, {
            name: `/help`,
            type: ActivityType.Playing,
        }, {
            name: `${client.guilds.cache.size} Servers | ${client.totalMemberCount} Members`,
            type: ActivityType.Watching,
        },
    ];

    const randomIndex = Math.floor(Math.random() * activityOptions.length);
    return activityOptions[randomIndex];
}

async function updateActivity(client) {
    if (!isBotStatusEnabled) {
        console.error("[+]".green + ` Sucessfully Enabled Bot Status.`);
        isBotStatusEnabled = true;
    }

    client.totalMemberCount = await getMemberCount(client);
    const randomActivity = getRandomActivity(client);

    client.user.setActivity(randomActivity.name, { type: randomActivity.type });
}

async function getMemberCount(client) {
    let totalMemberCount = 0;

    try {
        await client.guilds.fetch();
        client.guilds.cache.forEach((guild) => {
            totalMemberCount += guild.memberCount;
        });
    } catch (err) {
        console.error(`Error Fetching Member Count:`, err);
    }
    return totalMemberCount;
}

module.exports = { updateActivity, getMemberCount };