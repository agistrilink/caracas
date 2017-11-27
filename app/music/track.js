'use strict';

const _ = require('../mvc/miracle'),
    path = require('path'),
    Node = require('../fs/node'),
    Directory = require('../fs/directory'),
    File = require('../fs/file'),
    {Encoding, FLAC, MP3, KBS320} = require('./encoding'),
    childProcess = require('child_process')/*,
    mm = require('musicmetadata'),
    _nodeId3Read = _.promisy(nodeID3.read, nodeID3),
    _nodeId3Update = _.promisy(nodeID3.update, nodeID3)*/;

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

    getTags() {
        console.log(this.fullPath);
        mm(fs.createReadStream('sample.mp3'), function (err, metadata) {
            if (err) throw err;
            console.log(metadata);
        });
        const tags = nodeID3.read(this.fullPath);
        return _.newResolved(tags);
        console.log(tags);
        return _nodeId3Read(this.fullPath);
    }

    updateTags(tags) {
        return _nodeId3Update(tags, this.fullPath);
    }

    static convertFlacToMp3(fromFlacTrack, toDir) {
        return new Promise((resolve, reject) => {
            if (!fromFlacTrack.encoding.isFlac()) {
                reject('cannot convert non-flac file: ' + fromFlacTrack.fullPath);
            }

            const fromAlbumTag = new Node({fullPath: fromFlacTrack.basePath}).baseName,
                toAlbumTag = fromAlbumTag.substr(0, fromAlbumTag.lastIndexOf(' ')).trim() + ' ' + KBS320.ext,
                toMp3Track = new Track({fullPath: toDir.fullPath + '/' + fromFlacTrack.title + '.' + MP3.type}),
                // https://ffmpeg.org/ffmpeg.html#Generic-options
                ffmpeg = childProcess.spawn("ffmpeg", [
                    "-i", fromFlacTrack.fullPath,
                    "-ab", "320k",
                    "-map_metadata", "0",
                    "-metadata", 'album=' + toAlbumTag,
                    "-id3v2_version", "3",
//                "-logLevel", "error", // default info level
                    "-y",
                    toMp3Track.fullPath
                ]);

            ffmpeg.stdout.on('close', function (data) {
                console.log('converted flac to ' + toMp3Track.fullPath);

                resolve();



                /*                return;
                fromFlacTrack.getTags()
                    .then(fromTags => {
                        console.log(fromTags);
                        const fromAlbumTag = fromTags.album;

                        return toMp3Track.updateTags({
                            album: fromAlbumTag.substr(0, fromAlbumTag.lastIndexOf(' ')).trim() + ' ' + KBS320.ext
                        });
                    })
                    .then(resolve)
                    .catch(reject);*/

            });

            // NOTE: ffmpeg outputs to standard error - Always has, always will no doubt
/*
            ffmpeg.stderr.on('data', function (data) {
                console.log(data);
            });
*/
        });
    };

    static isA(fullPath) {
        return !!new Track({fullPath: fullPath}).encoding;
    }
};

module.exports = Track;
