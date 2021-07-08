require("dotenv").config();
const { Client } = require("discord.js");
const client = new Client();
module.exports = client;

require("./functions/quote");
require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);

client.login(process.env.TOKEN);