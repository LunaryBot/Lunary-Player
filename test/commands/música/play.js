const Discord = require('discord.js')
const { Utils: { Song } } = require('../../../src/index')
const { URL } = require("url")

module.exports = class EvalCommand {
    constructor() {
        this.name = "play"
        this.aliases = ["p"]
        this.description = "Toque uma música"
        this.categoria = "música"
        this.run = this.run
    }

    async run(client, message, args) {
        if(!client.music.idealNodes[0]) return message.quote(new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("**Estou sem conexão com meus nodes, não posso tocar agora.**")
        )

        if(!message.member.voice.channel) return message.quote(new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("**Você precisa estar em um canal de voz.**")
        )
        let player = client.music.players.get(message.guild.id)
        if(!player) {
            player = await client.music.join({ 
                guild: message.guild.id, 
                channel: message.member.voice.channel.id, 
                node: client.music.idealNodes[0].id 
            }, { selfdeaf: true })
        }
        player.text = message.channel

        let search
        try {
            new URL(args.join(' '))
            search = args.join(' ')
        } catch(_) {
            search = `ytsearch:${args.join(' ')}`
        }

        const results = await player.searchSongs(search, message.author)
        
        if(results.loadType == 'LOAD_FAILED') return message.quote(new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("**Aconteceu um erro ao carregar a música.**")
        )
        else if(results.loadType == 'NO_MATCHES') {
            if(player.queue.totalSize == 0) client.music.leave(message.guild.id)
            return message.quote(new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Não consegui achar a música.**")
            )
        }
        else if(results.loadType == 'PLAYLIST_LOADED') {
            results.tracks.map(t => player.queue.push(t));

            message.quote(new Discord.MessageEmbed()
                .setColor("BLUE")
                .setDescription(`${results.playlistInfo.name} | ${results.tracks.length} Músicas`)
            )

            if(!player.queue.current) player.play()
        } else {
            player.queue.push(results.tracks[0])

            message.quote(new Discord.MessageEmbed()
                .setColor("BLUE")
                .setDescription(`${results.tracks[0].title}`)
            )

            if(!player.queue.current) player.play()
        }
    }
}