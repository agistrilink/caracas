'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('../fs/directory'),
    File = require('../fs/file'),
    {Encoding, FLAC, MP3} = require('./encoding'),
    childProcess = require('child_process');

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

    static convertFlacToMp3(track, toFullPath) {
        if (!track.encoding.isFlac()) {
            throw 'cannot convert non-flac file: ' + track.fullPath;
        }

        const outputBaseName = track.title + '.' + MP3.type,
            outputFullPath = toFullPath + '/' + outputBaseName,
            args = [
                "-i", track.fullPath,
                "-ab", "320k",
                "-map_metadata", "0",
                "-id3v2_version", "3",
                "-y",
                outputFullPath
            ],
            ffmpeg = childProcess.spawn("ffmpeg", args);

        ffmpeg.stdout.on('close', function (data) {
            console.log('converted!!: ' + outputBaseName);
        });

        // NOTE: ffmpeg outputs to standard error - Always has, always will no doubt
        ffmpeg.stderr.on('data', function (data) {
            console.log(data.toString());
        });
    };

    static isA(fullPath) {
        return !!new Track({fullPath: fullPath}).encoding;
    }
};

module.exports = Track;
