const fs = require("fs")

module.exports = (client) => {
  client.commands = new Map();
  client.aliases = new Map();
  let pastas = fs.readdirSync(__dirname + "/../commands");
  for(let pasta of pastas) {
    let commands = fs.readdirSync(__dirname + "/../commands/" + pasta).filter(file => file.split(".").pop() == "js");
    for (command of commands) {
      let base = require(__dirname + `/../commands/${pasta}/${command}`)
      if(typeof base == "function") {
        let cmd = new base()
        client.commands.set(cmd.name, cmd)
        for(let aliase of cmd.aliases) {
          client.aliases.set(aliase, cmd.name)
        }
      }
    }
  }
}