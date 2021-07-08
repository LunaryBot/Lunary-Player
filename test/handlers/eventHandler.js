const fs = require("fs")

module.exports = (client) => {
  let events = fs.readdirSync(__dirname + "/../events").filter(file => file.split(".").pop() == "js");
  for(let event of events) {
    require(__dirname + `/../events/${event}`)
  }
}