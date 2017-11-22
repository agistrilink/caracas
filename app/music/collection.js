'use strict';

const _ = require('../mvc/miracle'),
    path = require('path'),
    async = require('async'),
    Artist = require('./artist'),
    Directory = require('../fs/directory'),
    {Encoding, ANY} = require('./encoding');

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

    static sync(master, slave, options){
        options = _.defaults(options, {
            regex: /.+/ // e.g. /^[A-D]/
        });

//        return Promise.all([_.newResolved(), _.newResolved(), _.newResolved()]);

        return Promise.all(
            slave.getArtistNames()
                .filter(name => {
                    return !master.hasArtist(name);
                })
                .map(name => {
                    return slave.removeArtist(name);
                })
        )
        .then(__ => {
            return Promise.all(
                master.getArtistNames()
                    .filter(name => {
                        return !slave.hasArtist(name);
                    })
                    .map(name => {
                        return slave.addArtist(name);
                    })
            );
        })
        .then(__ => {
            return Promise.all(
                master.getArtistNames()
                    .filter(name => {
                        return name.search(options.regex) >= 0;
                    })
                    .map(name => {
                        return Artist.sync(
                            master.getArtist(name),
                            slave.getArtist(name)
                        );
                    })
            );
        })
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
        })

        return encodings;
    }
}

module.exports = Collection;
