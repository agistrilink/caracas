'use strict';

const _ = require('lodash'),
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
        return new Album({
            fullPath: this.createDir(title + ' ' + encoding.ext)
        });
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

    importAlbum(fromAlbum){
        const isFlacToMp3 = this.encoding.isMp3() && fromAlbum.encoding.isFlac();

        if (!isFlacToMp3){
            Directory.copyDir(fromAlbum.fullPath, this.fullPath);
            return;
        }

        const toAlbum = this.newAlbum(fromAlbum.title, KBS320);
        fromAlbum.tracks.forEach(track => {
            toAlbum.importTrack(track);
        });
    }

    copyAlbum(album){
        const isFlacToMp3 = this.encoding.isMp3() && album.encoding.isFlac();

        if (isFlacToMp3){
            Album.convertFlacToMp3(album, this.fullPath);
        }
        else {
            console.log('deep copy of ' + album.fullPath + ' to ' + this.fullPath);
        }
    }

    removeAlbum(name){
        return this.deleteDir(name);
    }

    getAlbumNames(options) {
        return this.getSubDirectoriesBaseNames(options);
    }

    static sync(master, slave){
        const isSlaveMp3 = slave.encoding.isMp3();

        console.log(slave.fullPath);
        // probably master album renamed
        slave.getAlbumNames()
            .filter(name => {
                console.log(name);
                const album = new Album(name);
                console.log(album);
                return !master.hasAlbum(album.title);
            })
            .forEach(name => {
                slave.removeAlbum(name);
            });

        // encoding differences // X:\VHE\vsc\Music\caracas\slave
        slave.getAlbumNames({force: true})
            .filter(name => {
                return !master.hasAlbum(name, {strict: true});
            })
            .forEach(name => {
                const masterAlbumEncoding = master.getAlbum(Album.asTitle(name)).encoding,
                    slaveAlbum = slave.getAlbum(name, {strict: true}),
                    slaveAlbumEncoding = slaveAlbum.encoding,
                    compare = Encoding.compare(masterAlbumEncoding, slaveAlbumEncoding);

                // master album encoding lower or equal than slave's
                if (Encoding.compare(masterAlbumEncoding, slaveAlbumEncoding) <= 0){
                    return;
                }

                // master album encoding bigger now

                if (slave.encoding.isAny() || slaveAlbumEncoding !== KBS320){
                    slave.removeAlbum(name);
                }
            });


        master.getAlbumNames()
            .filter(title => {
                return !slave.hasAlbum(title);
            })
            .forEach(title => {
                const album = master.getAlbum(title),
                    isFlacToMp3 = isSlaveMp3 && album.encoding.isFlac();

                if (!isFlacToMp3){
                    // deep copy album to slave

                    return;
                }

                slave.importAlbum(album);
            });
    }

};

module.exports = Artist;
