Object.defineProperty(exports, "__esModule", { value: true })

const { EventEmitter } = require("events")
const Queue = require("./Queue")
const { default: axios } = require('axios')
const PlayerEffects = require("./functions/PlayerEffects")
const { Song } = require("../utils/Song")

class Player extends EventEmitter {
    constructor(node, id) {
        super()
        this.id = id
        this.node = node
        this.client = this.node.manager.client
        this.state = { volume: 100 }
        this.playing = false
        this.timestamp = null
        this.paused = false
        this.queueIndex = 0
        this.queue = new Queue()
        this.trackPosition = this.position
        this.effects = new PlayerEffects(this)
        this.voiceUpdateState = null
        this.on("event", data => {
            switch (data.type) {
                case "TrackStartEvent":
                    if (this.listenerCount("start")) this.emit("start", data)
                    break
                case "TrackEndEvent":
                    if (data.reason !== "REPLACED") this.playing = false
                    this.track = null
                    this.timestamp = null
                    if (this.listenerCount("end")) this.emit("end", data)
                    break
                case "TrackExceptionEvent":
                    if (this.listenerCount("error")) this.emit("error", data)
                    break
                case "TrackStuckEvent":
                    this.stop()
                    if (this.listenerCount("end"))
                        this.emit("end", data)
                    break
                case "WebSocketClosedEvent":
                    if (this.listenerCount("error"))
                        this.emit("error", data)
                    break
                default:
                    if (this.listenerCount("warn"))
                        this.emit("warn", `Unexpected event type: ${data.type}`)
                    break
            }
        })
        .on("playerUpdate", data => {
            this.state = { volume: this.state.volume, ...data.state }
        })

        this.on('end', () => {
            if(this.queue.length <= 0) {
                this.destroy()
                if(this.manager.listenerCount("event")) this.manager.emit("event", {
                    type: "PlayerQueueEnd",
                    player: this
                })
                return this.manager.leave(this.id)
            }

            this.queueIndex += 1

            this.play()
        })
    }
    async superPlay(track, options = {}) {
        const d = await this.send("play", { ...options, track: track.track })
        this.playing = true
        this.timestamp = Date.now()
        if(this.manager.listenerCount("event")) this.manager.emit("event", {
            type: "PlayerTrackStart",
            player: this,
            track: track
        })
        return d
    }

    // async play(options = {}) {
    //     let proviusTrack = this.queue.current 
    //     const track = this.queue.shift()
    //     if(!track) {
    //         if(this.manager.listenerCount("event")) this.manager.emit("event", {
    //             type: "PlayerQueueEnd",
    //             player: this
    //         })
    //       return
    //     }
    //     if(this.queue.current && options.addPrevius != false) this.queue.previousTracks.unshift(this.queue.current)
        
    //     // if(this.queue.previous && this.queue.previous.isStream && !track.isStream) {
    //     //   if(this.vaporwave) this.setVaporwave(true)
    //     //   if(this.nightcore) this.setNightcore(true)
    //     // }

    //     this.queue.current = track
    //     if(this.queue[0]) this.queue.next = this.queue[0]
    //     await this.superPlay(track)
    //     return this
    // }

    async play(options = {}) {
        let proviusTrack = this.queue.current 
        const track = this.queue[this.queueIndex]
        if(!track) {
            if(this.manager.listenerCount("event")) this.manager.emit("event", {
                type: "PlayerQueueEnd",
                player: this
            })
          return
        }

        this.queue.current = track
        if(this.queue[this.queueIndex - 1]) this.queue.previous = this.queue[this.queueIndex - 1]
        if(this.queue[this.queueIndex + 1]) this.queue.next = this.queue[this.queueIndex + 1]
        await this.superPlay(track)
        return this
    }

    searchSongs(query, requester) {
        const URL = `http${this.node.port ? '' : 's'}://${this.node.host}${this.node.port ? `:${this.node.port}` : ''}/loadtracks`
        const a = new URLSearchParams({
          identifier: query
        })
        return axios.get(URL + `?${a.toString()}`, {
          headers: { Authorization: this.node.password }
        }).then(res => {
          if(res.status != 200) throw res.statusText
          res.data.tracks = res.data.tracks.map(function(data) {
              let track = new Song(data, requester, res.data.playlistInfo, query)
              return track
          })
          return res.data
        })
    }

    async stop() {
        const d = await this.send("stop")
        this.playing = false
        this.timestamp = null
        return d
    }
    async pause(pause) {
        const d = await this.send("pause", { pause })
        this.paused = pause
        if (this.listenerCount("pause")) this.emit("pause", pause)
        return d
    }
    resume() {
        return this.pause(false)
    }
    async seek(position) {
        const d = await this.send("seek", { position })
        if (this.listenerCount("seek"))
            this.emit("seek", position)
        return d
    }
    async equalizer(bands) {
        const d = await this.send("equalizer", { bands })
        this.state.equalizer = bands
        return d
    }
    destroy() {
        return this.send("destroy")
    }
    connect(data) {
        this.voiceUpdateState = data
        return this.send("voiceUpdate", data)
    }
    switchChannel(channel, options = {}) {
        return this.manager.sendWS(this.id, channel, options)
    }
    send(op, data) {
        if (!this.node.connected) return Promise.reject(new Error("No available websocket connection for selected node."))
        return this.node.send({ ...data, op, guildId: this.id })
    }

    skip() {
        this.send("stop")
        return this
    }

    back() {
        if(!this.queue.previous) return this 
        this.queueIndex = this.queueIndex - 2
        this.skip()
        return this.queueIndex + 1
    }

    get manager() {
        return this.node.manager
    }

    get position() {
        if(!this.queue.current) return 0
        else return this.queue.current.duration - ((this.timestamp + this.queue.current.duration) - Date.now())
    }
}

exports.Player = Player