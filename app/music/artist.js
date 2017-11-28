'use strict';

const _ = require('../mvc/miracle'),
    path = require('path'),
    Directory = require('../fs/directory'),
    async = require('async'),
    {Encoding, KBS320, ANY} = require('./encoding'),
    Album = require('./album');

class Artist extends Directory {

    constructor(obj, options){
        super(_.defaults(obj, {encoding: ANY}), options);
    }

    get name() {
        return this.baseName;
    }

    hasAlbum(title, options){
        options = _.defaults(options, {
            strict: false
        });

        const name = this.getAlbumNames().find(name => {
            return options.strict ? name === title : strpos(title, name) === 0;
        });

        return !!name;
    }

    newAlbum(title, encoding){
        console.log(title);
        return new Promise((resolve, reject) => {
            this.createDir(title + ' ' + encoding.ext)
                .then(fullPath => {
                    resolve(new Album({fullPath: fullPath}));
                })
                .catch(reject);
        })
    }

    getAlbum(title, options){
        options = _.defaults(options, {
            strict: false
        });

        const name = this.getAlbumNames().find(name => {
            return options.strict ? name === title : name.indexOf(title) === 0;
        });

        return !!name ? new Album({fullPath: path.join(this.fullPath, name)}) : undefined;
    }

    importAlbum(fromAlbum, cb){
        const isLosslessToMp3 = this.encoding.isMp3() && fromAlbum.encoding.isLossless();

        if (!isLosslessToMp3){
            return Directory.copyDir(fromAlbum.fullPath, this.fullPath + '/' + fromAlbum.baseName);
        }

        return this.newAlbum(fromAlbum.title, KBS320)
            .then(toAlbum => {
                return Promise.all(
                    fromAlbum.tracks
                        .map(track => {
                            return toAlbum.importTrack(track);
                        })
                );
            });
    }

    removeAlbum(name){
        return this.deleteDir(name);
    }

    getAlbumNames(options) {
        return this.getSubDirectoriesBaseNames(options);
    }

    static sync(master, slave, cb){
        const isSlaveEncodingMp3 = slave.encoding.isMp3();

        return Promise.all(
                // probably master album renamed
                slave.getAlbumNames()
                    .filter(name => {
                        console.log(name);
                        const album = new Album(name);
                        console.log(album);
                        return !master.hasAlbum(album.title);
                    })
                    .map(name => {
                        return slave.removeAlbum(name);
                    })
            )
            .then(__ => {
                return Promise.all(
                    // encoding differences
                    slave.getAlbumNames({force: true})
                        .filter(name => {
                            return !master.hasAlbum(name, {strict: true});
                        })
                        .map(name => {
                            const masterAlbumEncoding = master.getAlbum(Album.asTitle(name)).encoding,
                                slaveAlbum = slave.getAlbum(name, {strict: true}),
                                slaveAlbumEncoding = slaveAlbum.encoding;

                            // master album encoding lower or equal than slave's
                            if (Encoding.compare(masterAlbumEncoding, slaveAlbumEncoding) <= 0){
                                return _.newResolved();
                            }

                            // master album encoding bigger now

                            if (slave.encoding.isAny() || slaveAlbumEncoding !== KBS320){
                                return slave.removeAlbum(name);
                            }
                        })
                );
            })
            .then(__ => {
                return Promise.all(
                    master.getAlbumNames()
                        .filter(title => {
                            return !slave.hasAlbum(title);
                        })
                        .map((title) => {
                            return slave.importAlbum(master.getAlbum(title));
                        })
                );
            });
    }
};

module.exports = Artist;
