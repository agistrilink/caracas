'use strict';

const _ = require('../mvc/kraftaverk'),
    path = require('path'),
    async = require('async'),
    config = require('../config/config'),
    Artist = require('./artist'),
    Directory = require('../fs/directory'),
    {Encoding, ANY} = require('./encoding'),
    isSkipArtist = name => {
        return config.sync && config.sync.skip && config.sync.skip.artist &&
            config.sync.skip.artist.indexOf(name) >= 0;
    };

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

    getArtistNames(options) {
        options = _.defaults(options, {
            isFilterSkipArtist: true
        });

        const names = this.getSubDirectoriesBaseNames();
        return options.isFilterSkipArtist
            ? names.filter(_.not(isSkipArtist))
            : names;
    }

    static sync(master, slave, options){
        options = _.defaults(options, {
            regex: /.+/ // e.g. /^[A-D]/
        });

        return _.Promise.each(
            slave.getArtistNames().filter(name => !master.hasArtist(name)),
            name => slave.removeArtist(name)
        )
        .then(__ => _.Promise.each(
            master.getArtistNames().filter(name => !slave.hasArtist(name)),
            name => slave.addArtist(name)
        ))
        .then(__ => _.Promise.each(
            master.getArtistNames().filter(name => name.search(options.regex) >= 0),
            name => Artist.sync(master.getArtist(name), slave.getArtist(name))
        ))
        ;
    }

    // helper function to identify and manually adjust albums in collection with wrong encoding label
    getEncodings() {
        const encodings = [];

        // walk and collect encodings
        this.getSubDirectories().forEach(artistFullPath => {
            new Artist({fullPath: artistFullPath}).getSubDirectories().forEach(albumFullPath => {
                const encoding = albumFullPath.split(' ').splice(-1).shift();

                if (!Encoding.getFromKey(encoding, {doThrow: false})){
                    console.log('unknown encoding: ' + albumFullPath);
                }
                else if (encodings.indexOf(encoding) === -1){
                    encodings.push(encoding);
                }
            });
        });

        return encodings;
    }
}

module.exports = Collection;
