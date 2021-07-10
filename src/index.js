const { Playlist, Song } = require("./utils/Song");

module.exports = {
    Manager: require("./_Manager"),
    Player: require("./player/Player"),
    Queue: require("./player/Queue"),
    Utils: {
        Song: Song,
        Playlist: Playlist
    }
}