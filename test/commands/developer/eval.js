const Discord = require('discord.js')

module.exports = class EvalCommand {
    constructor() {
        this.name = "eval"
        this.aliases = ["e", "eva", "evl"]
        this.description = "..."
        this.categoria = "developer"
        this.run = this.run
    }

    async run(client, message, args) {
        if(!["452618703792766987", "699416429338034268", "343778106340802580"].includes(message.author.id)) return message.quote(new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setAuthor("Comando restrito", "https://cdn.discordapp.com/emojis/829429780155858974.gif?size=2048")
        .setDescription("**Apenas meus desenvolvedores podem usar este comando!**"))

        let player = client.music.players.get(message.guild.id)
        let conteudo = args.join(" ").replace(/```js|```/g, "")
        const start = Date.now()
        try {
            let result = await eval(conteudo)

            if (result instanceof Promise) {
                await result
            }

            if (typeof result !== 'string') result = await require('util').inspect(result, { depth: 0 })
            let end = (Date.now() - start)

            resultado(client, message, result)
        } catch (e) {
            resultado(client, message, e)
        }
    }
}

async function resultado(client, message, result) {
    message.quote(`${result}`.replace(client.token, "No9-iu8w0Jha9US9H-aJplkdsj.jshuss9DsAShsahp989Sf4k3fd/").slice(0, 1990), {code: "js"})
}