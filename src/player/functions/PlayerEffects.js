Object.defineProperty(exports, "__esModule", { value: true })

class PlayerEffects {
    constructor(player) {
        this.player = player
        this.volume = 100
        this.nightcore = false
        this.vaporwave = false
        this._8d = false
        this.equalizer = []
    }

    setFilter() {
        let obj = {}

        if(this.nightcore) {
            obj.timescale = { pitch: 1.3 }
            if(this.player.queue.current && !this.player.queue.current.isStream) obj.timescale.speed = 1.2 
        }

        if(this.vaporwave) {
            obj.timescale = { pitch: 1.3 }
            if(this.player.queue.current && !this.player.queue.current.isStream) obj.timescale.speed = 1.2 
        }

        if(this._8d) obj.rotation = { rotationHz: 0.1 }

        if(this.equalizer.length) obj.equalizer = this.equalizer  

        this.player.send("filters", obj)

        return this
    }

    setNightcore(value) {
        value = bol(value)
        this.nightcore = value
        if(this.vaporwave && this.nightcore) this.vaporwave = false

        return this.setFilter()
    }

    setVaporwave(value) {
        value = bol(value)
        this.vaporwave = value
        if(this.nightcore && this.vaporwave) this.nightcore = false

        return this.setFilter()
    }

    set8D(value) {
        value = bol(value)
        this._8d = value

        return this.setFilter()
    }

    setEqualizer(value) {
        value = Array.isArray(value) ? value : (bol(value) ? [
            ...new Array(3).fill(null).map((_, i) => ({ band: i, gain: 0.3 }))
        ] : [])
        this.equalizer = value
        
        return this.setFilter()
    }

    setVolume(value) {
        this.send("volume", { volume })
        this.volume = value
        
        return this
    }
}

function bol(value) {
    return typeof value == 'boolean' ? value : Boolean(value)
}

module.exports = PlayerEffects