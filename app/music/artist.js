'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('../fs/directory'),
    async = require('async');

class Artist extends Directory {

    constructor(obj, options){
        super(obj, _.defaults(options, {encoding: 'any'}));
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

    getAlbum(title, options){
        options = _.defaults(options, {
            strict: false
        });

        const name = this.getAlbumNames().find(name => {
            return options.strict ? name === title : name.indexOf(title) === 0;
        });

        return !!name ? new Album({fullPath: path.join(this.fullPath, name)}) : undefined;
    }

    copyAlbum(from){
        const fromAlbum = new Album(from),
            isFlacToMp3 = this.encoding === 'mp3' && fromAlbum.encoding.isFlac();

        if (isFlacToMp3){
            console.log('gonna transform to mp3: ' + fromAlbum.fullPath);
        }
        else {
            console.log('deep copy of ' + fromAlbum.fullPath + ' to ' + this.fullPath);
        }
    }

    removeAlbum(name){
        return this.deleteDir(name);
    }

    getAlbumNames(options) {
        return this.getSubDirectoriesBaseNames(options);
    }

    static sync(master, slave){
        console.log(slave.fullPath);
        // probably master album renamed
        slave.getAlbumNames()
            .filter(name => {
                return !master.hasAlbum(new Album(name).title);
            })
            .forEach(name => {
                slave.removeAlbum(name);
            });

        // encoding differences
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

                if (slave.encoding === 'any' || slaveAlbumEncoding.valueOf() !== Encoding.KBS320){
                    slave.removeAlbum(name);
                }
            });

        master.getArtistNames()
            .filter(name => {
                return !slave.hasAlbum(name);
            })
            .forEach(name => {
                slave.copyAlbum(name);
            });
    }

};

module.exports = Artist;
