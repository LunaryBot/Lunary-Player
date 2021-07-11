const { Playlist, Song } = require("./utils/Song");

module.exports = {
    Manager: require("./LavalinkManager"),
    Player: require("./player/Player"),
    Queue: require("./player/Queue"),
    Utils: {
        Song: Song,
        Playlist: Playlist
    }
}