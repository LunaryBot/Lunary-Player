const { Manager } = require("../../src/Manager");
const client = require("../client")

client.on("ready", async() => {
    client.music = new Manager(client, [
      {
        id: "Node 1",
        password: '1511970j',
        host: 'lunary-lavalink.herokuapp.com',
        options: {
            followRedirects: true
        }
      }
    ], {
    user: client.user.id
  });
  client.music.connect()
  .then(() => console.log('[LAVALINK] Sistema de música iniciado com sucesso!'))
  .catch(e => console.error(e));
})