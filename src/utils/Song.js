Object.defineProperty(exports, "__esModule", { value: true })
const { URL } = require("url")


class Song {
    constructor(track = {}, requester, playlistInfo, query) {
        this.title = track.info.title || "Unknown Title"
        this.author = track.info.author || "Unknown Artist"
        this.duration = track.info.length
        this.url = track.info.uri
        this.identifier = track.info.identifier
        this.artwork = track.info.artwork
        this.source = track.info.source
        this.isStream = track.info.isStream
        this.isSeekable = track.info.isSeekable
        this.track = track.track
        this.playlist = null
        this.requester = requester
        if(playlistInfo && query && checkURL(query)) this.playlist = new Playlist(playlistInfo, query)
    }
}

class Playlist {
    constructor(data = {}, url) {
        this.name = data.name || "Unknown name"
        this.url = url
        this.type = data.type
    }
}

function checkURL(string) {
    try {
        let url = new URL(String(string))
        return true
    } catch (_) {
        return false
    }
}

module.exports = {
    Song: Song,
    Playlist: Playlist
}