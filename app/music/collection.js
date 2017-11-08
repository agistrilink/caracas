'use strict';

const _ = require('lodash'),
    path = require('path'),
    Artist = require('./artist'),
    Directory = require('../fs/directory');

class Collection extends Directory {
    constructor(obj, options){
        super(obj, _.defaults(options, {encoding: 'any'}));
    }

    static sync(master, slave){
        console.log(slave.getArtistNames());
        slave.getArtistNames()
            .forEach(artistName => {
                if (!master.hasArtist(artistName)){
                    // remove slave.artist
                }
            });

        console.log(master.getArtistNames());
        master.getArtistNames()
            .forEach(artistName => {
                Artist.sync(
                    master.getArtist(artistName),
                    slave.hasArtist(artistName) ? slave.getArtist(artistName) : slave.addArtist(artistName)
                );
            });

    }

    hasArtist(name){
        return this.getArtistNames().indexOf(name) > -1;
    }

    getArtist(name){
        return new Artist({fullPath: path.join(this.fullPath, name), encoding: this.encoding});
    }

    addArtist(name){
        return this.createDir(name);
    }

    getArtistNames() {
        return this.getSubDirectoriesBaseNames();
    }
}

module.exports = Collection;
