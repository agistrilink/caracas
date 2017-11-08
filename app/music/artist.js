'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('../fs/directory');

class Artist extends Directory {
    
    constructor(obj, options){
        super(obj, options);
    }

    get name() {
        return this.baseName;
    }

    static sync(master, slave){/* 
        slave.getAlbumNames()
            .filter(name => {
                return !master.hasArtist(name);
            })
            .forEach(artistName => {
                slave.removeArtist(artistName);
            });

        master.getAlbumNames()
            .forEach(artistName => {
                Artist.sync(
                    master.getArtist(artistName),
                    slave.hasArtist(artistName) ? slave.getArtist(artistName) : slave.addArtist(artistName)
                );
            }); */

    }

};

module.exports = Artist;
