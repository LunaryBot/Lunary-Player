const Discord = require('discord.js')

module.exports = class PingCommand {
    constructor() {
        this.name = "ping"
        this.aliases = []
        this.description = "Veja meu ping"
        this.categoria = "bot"
        this.run = this.run
    }

    async run(client, message, args) {
        message.quote(`Ping: ${client.ws.ping}`)
    }
}