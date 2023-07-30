const { Client } = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../../config/config.json");
require("colors");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        await mongoose.connect(config.MONGODB || '');

        if (mongoose.connection.readyState === 1) {
            console.log("[+]".green + ' MongoDB Connection Successfully.');
        }

        console.log("\n[ONLINE]".green +` ${client.user.username} Started...`);
    },
};
