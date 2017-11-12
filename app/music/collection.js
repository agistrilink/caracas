'use strict';

const _ = require('lodash'),
    path = require('path'),
    Artist = require('./artist'),
    Directory = require('../fs/directory'),
    {ANY} = require('./encoding');

class Collection extends Directory {
    constructor(obj, options){
        super(_.defaults(obj, {encoding: ANY}), options);
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

    removeArtist(name){
        return this.deleteDir(name);
    }

    getArtistNames() {
        return this.getSubDirectoriesBaseNames();
    }

    static sync(master, slave){
        slave.getArtistNames()
            .filter(name => {
                return !master.hasArtist(name);
            })
            .forEach(name => {
                slave.removeArtist(name);
            });

        master.getArtistNames()
            .filter(name => {
                return !slave.hasArtist(name);
            })
            .forEach(name => {
                slave.addArtist(name);
            });

        master.getArtistNames()
            .forEach(name => {
                Artist.sync(
                    master.getArtist(name),
                    slave.getArtist(name)
                );
            });

    }

    getEncodings() {
        // walk and collect encodings
    }
}

module.exports = Collection;
