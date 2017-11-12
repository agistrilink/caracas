'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('../fs/directory'),
    {Encoding} = require('./encoding');

class Album extends Directory {
    constructor(obj, options){
        super(obj, options);
    }

    get encoding() {
        return Encoding.getFromKey(this.fullPath.split(' ').splice(-1));
    }

    get title(){
        const splitted = this.fullPath.split(' ');

        splitted.splice(-1);

        return splitted.join(' ');
    }

    importTrack(track){

    }

    static convertFlacToMp3(album, toFullPath){
        console.log('gonna transform to mp3: ' + album.fullPath);
    }
};

module.exports = Album;
