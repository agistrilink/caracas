'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('./directory');

class Collection extends Directory {
    constructor(obj, options){
        super(obj, _.defaults(options, {encoding: 'any'}));
    }

    static sync(master, slave){
        master.getArtistNames()
            .each(artistName => {
                if (!slave.hasArtist(artistName)){
                    slave.addArtist(artistName);
                }
                const slaveArtist = 
                Artist.sync(
                    master.getArtist(artistName),
                    slave.hasArtist(artistName) ? slave.getArtist(artistName) : slave.addArtist(artistName)
                );
            });

        slave.getArtistNames()
            .each(artistName => {
                if (!master.hasArtist(artistName)){
                    // remove slave.artist
                }
            });
    }

    hasArtist(name){
        return this.getArtistNames().indexOf(name) > -1;
    }

    getArtistNames() {
        return this.getSubDirectoriesBaseNames();
    }

    getArtist
}

module.exports = Collection;
