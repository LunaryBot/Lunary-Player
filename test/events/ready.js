const { Manager } = require("../../src/Manager");
const client = require("../client")

client.on("ready", async() => {
    client.music = new Manager(client, client.config.lavalink_nodes, {
    user: client.user.id
  });
  client.music.connect()
  .then(() => console.log('[LAVALINK] Sistema de música iniciado com sucesso!'))
  .catch(e => console.error(e));
})