'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('../fs/directory'),
    {Encoding, FLAC, MP3} = require('./encoding');

class Track extends File {
    constructor(obj, options) {
        super(obj, options);
    }

    get encoding() {
        return Encoding.getFromKey(path.extname(this.fullPath).slice(1));
    }

    get title() {
        return path.basename(this.fullPath, '.' + this.encoding.type);
    }

    static convertFlacToMp3(track, toAlbum) {
        if (!track.encoding.isFlac()) {
            throw 'cannot convert non-flac file: ' + track.fullPath;
        }

        const args = [
                "-i", fromFile.fullPath,
                "-ab", "320k",
                "-map_metadata", "0",
                "-id3v2_version", "3",
                "-y",
                toAlbum.fullPath + '/' + track.title + '.' + MP3.type
            ],
            ffmpeg = childProcess.spawn("ffmpeg", args);

        // NOTE: ffmpeg outputs to standard error - Always has, always will no doubt

        ffmpeg.stdout.on("data", function (data) {
//            onData({out: data})
        });

        ffmpeg.stderr.on("data", function (data) {
//            onData({err: data})
        });
    };

    static isA(fullPath) {
        return !!this.encoding;
    }
};

module.exports = Album;
