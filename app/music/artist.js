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

    constructor(obj, options){
        super(obj, _.defaults(options, {encoding: 'any'}));
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
            return options.strict ? name === title : strpos(title, name) === 0;
        });

        return !!name ? new Album({fullPath: path.join(this.fullPath, name)}) : undefined;
    }

    addAlbum(name){
        return this.createDir(name);
    }

    removeAlbum(name){
        return this.deleteDir(name);
    }

    getAlbumNames(options) {
        return this.getSubDirectoriesBaseNames(options);
    }

    static sync(master, slave){/*
        slave.getAlbumNames()
            .filter(name => {
                return !master.hasAlbum(name);
            })
            .forEach(artistName => {
                slave.removeAlbum(artistName);
            });

        master.getAlbumNames()
            .forEach(artistName => {
                Album.sync(
                    master.getAlbum(artistName),
                    slave.hasAlbum(artistName) ? slave.getAlbum(artistName) : slave.addAlbum(artistName)
                );
            }); */

    }

};

module.exports = Artist;
