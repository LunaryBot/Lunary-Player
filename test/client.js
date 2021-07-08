const { Client } = require("discord.js");
const client = new Client();
client.config = require("./handlers/config")
module.exports = client;



require("./functions/quote");
require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);

client.login(client.config.token);