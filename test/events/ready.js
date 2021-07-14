const { Manager } = require("../../src/Manager");
const Discord = require("discord.js")
const client = require("../client")

client.on("ready", async() => {
    client.music = new Manager(client, client.config.lavalink_nodes, {
    user: client.user.id
  });
  client.music.connect()
  .then(() => console.log('[LAVALINK] Sistema de música iniciado com sucesso!'))
  .catch(e => console.error(e))

  client.music
  .on("PLAYER_TRACK_START", (player, track) => {
    player.text.send(new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(`**${track.title}**`)
      .setFooter(track.requester.tag, track.requester.displayAvatarURL({ }))
    )
  })
  .on("PLAYER_TRACK_START", (player, track) => {
    console.log(`O track ${track.title} foi iniciado`)
  })
})