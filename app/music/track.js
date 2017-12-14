'use strict';

const _ = require('../mvc/miracle'),
    path = require('path'),
    Node = require('../fs/node'),
    Directory = require('../fs/directory'),
    File = require('../fs/file'),
    {Encoding, FLAC, MP3, KBS320} = require('./encoding'),
    childProcess = require('child_process'),
    nodeID3 = require('node-id3'),
    _nodeId3Update = _.promisy(nodeID3.update, nodeID3)

    /*,
    mm = require('musicmetadata'),
    _nodeId3Read = _.promisy(nodeID3.read, nodeID3),
    _nodeId3Update = _.promisy(nodeID3.update, nodeID3)*/;

class Track extends File {
    constructor(obj, options) {
        super(obj, options);

        this.encoding = Encoding.getFromKey(path.extname(this.fullPath).slice(1));
        this.title = path.basename(this.fullPath, '.' + this.encoding.type);
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

    static convertLosslessToMp3(fromTrack, toDir, options) {
        // skip or reject any directory, jpeg file, m3u etc.
        options = _.defaults(options, {
            isRejectOnNonTrackFiles: false
        });

        return new Promise((resolve, reject) => {
            if (!fromTrack.encoding.isLossless() && !fromTrack.encoding.isMp3()) {
                options.isRejectOnNonTrackFiles
                    ? reject('cannot convert non-track file: ' + fromTrack.fullPath)
                    : resolve();
            }

            const fromAlbumTag = new Node({fullPath: fromTrack.basePath}).baseName,
                toAlbumTag = fromAlbumTag.substr(0, fromAlbumTag.lastIndexOf(' ')).trim() + ' ' + KBS320.ext,
                toTrackFullPath = toDir.fullPath + '/' + fromTrack.title + '.' + MP3.type;

            if (fromTrack.encoding.isLossless()){
                const toMp3Track = new Track({fullPath: toTrackFullPath}),
                    // https://ffmpeg.org/ffmpeg.html#Generic-options
                    ffmpeg = childProcess.spawn("ffmpeg", [
                    "-i", fromTrack.fullPath,
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
                });

                // no reject case...

                return;
            }

            if (fromTrack.encoding.isMp3()){
                File.copyFile(fromTrack.fullPath, toTrackFullPath)
                    .then(_.curry(_nodeId3Update, {album: toAlbumTag}, toTrackFullPath))
                    .then(resolve)
                    .catch(reject);
            }
        });
    };

    static isA(fullPath) {
        return !!Encoding.getFromKey(path.extname(fullPath).slice(1), {doThrow: false});
    }
};

module.exports = Track;
