'use strict';

const _ = require('../mvc/kraftaverk'),
    path = require('path'),
    File = require('../fs/file'),
    Directory = require('../fs/directory'),
    {Encoding} = require('./encoding'),
    Track = require('./track');

class Album extends Directory {
    constructor(obj, options){
        super(obj, options);
    }

    get encoding() {
        const key = this.fullPath.split(' ').splice(-1).shift(),
            encoding = Encoding.getFromKey(key);

//        console.log('encoding key: ' + key + ', encoding: ' + encoding);

        return encoding;
    }

    get title(){
        const splitted = this.baseName.split(' ');

        splitted.splice(-1);

        return splitted.join(' ');
    }

    get tracks() {
        return this.getFiles()
            .filter(fullPath => {
                return Track.isA(fullPath);
            })
            .map(fullPath => {
                return new Track({fullPath: fullPath});
            });
    }

    importTrack(track){
//        console.log(this.baseName + ': importing track ' + track.title);
//        if (track.encoding.isLossless()) {
            return Track.convertLosslessToMp3(track, this);
//        }

    }

    static convertFlacToMp3(album, toFullPath){
        console.log('gonna transform to mp3: ' + album.fullPath);
    }
};

module.exports = Album;
