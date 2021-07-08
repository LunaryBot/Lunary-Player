const client = require("../client")

client.on("message", async message => {
  //client.messages.set(`${message.id}_${message.channel.id}`, message)
  if(message.author.bot || message.channel.type == "dm" || message.webhookID) return;

  const perms = message.channel.permissionsFor(message.client.user);
if(!perms.has("SEND_MESSAGES")) return;

  if(!perms.has("EMBED_LINKS")) return message.quote(`> Eu preciso de permissão de \`Enviar Links\``)
  if(!perms.has("USE_EXTERNAL_EMOJIS")) return message.quote(`> Eu preciso de permissão de \`Usar Emojis Externos\``)
  if(!perms.has("ADD_REACTIONS")) return message.quote(`> Eu preciso de permissão de \`Adicionar Reações\``)
  if(!perms.has("ATTACH_FILES")) return message.quote(`> Eu preciso de permissão de \`Anexar arquivos\``)

  let prefixo
  let mentions = [`<@${client.user.id}> `, `<@${client.user.id}>`, `<@!${client.user.id}> `, `<@!${client.user.id}>`, "^"]
  for (let i of mentions) {
    if(message.content.startsWith(i.toLowerCase())) {
      prefixo = i
      break;
    }
  }
  if(!prefixo) return;
  if(!message.content.startsWith(prefixo.toLowerCase())) return;

  const args = message.content.trim().slice(prefixo.length).split(/ +/g);
  const command = args.shift().toLowerCase();
  if(!command) return;
  let cmdfile = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if(!cmdfile) return;

  try {
    cmdfile.run(client, message, args);
  } catch (_) {};
})