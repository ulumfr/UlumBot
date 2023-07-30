function loadCommands(client) {
    const ascii = require("ascii-table");
    const fs = require("fs");
    const table = new ascii().setHeading("Commands", "Status");
    require("colors");

    let commandsArray = [];
    let developerArray = [];
    
    const commandsFolder = fs.readdirSync("./src/commands");
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));
    
        for (const file of commandFiles) {
            const commandName = file.replace(".js", "");
            const commandFile = require(`../commands/${folder}/${file}`);
    
            const properties = {folder, ...commandFile};
            client.commands.set(commandFile.data.name, properties);
    
            if (commandFile.developer) {
                developerArray.push(commandFile.data.toJSON());
            }else{
                commandsArray.push(commandFile.data.toJSON());
            }
            table.addRow(commandName, "✓");
            continue;
        }
    }
    client.application.commands.set(commandsArray);
    return console.log(table.toString(), "\n[+]".green + " Loaded Commands.");
}

module.exports = {loadCommands};