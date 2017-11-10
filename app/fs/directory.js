'use strict';

const _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    Base = require('../mvc/base'),
    ncp = require('ncp').ncp;

class Directory extends Base {
//    subDirectories = undefined;

    get basePath() {
        return path.dirname(this.fullPath);
    }

    get baseName() {
        return path.basename(this.fullPath);
    }

    hasSubDir(baseName){
        return this.getSubDirectories().indexOf(path.join(this.fullPath, baseName)) > -1;
    }

    // https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
    getSubDirectories(options){
        options = _.defaults(options, {
            force: false
        });

        if (this.subDirectories && !options.force){
            return this.subDirectories;
        }

        return this.subDirectories = fs.readdirSync(this.fullPath)
            .map(baseName => path.join(this.fullPath, baseName))
            .filter(Directory.isA);
    }

    getSubDirectoriesBaseNames(options) {
        return this.getSubDirectories(options)
            .map(fullPath => {return path.basename(fullPath)});
    }
    
    
    createDir(baseName){
        console.log('creating dir: ' + path.join(this.fullPath, baseName));
    }

    copyDir(src, dest, cb){
        ncp(source, destination, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
        });
    }

    deleteDir(baseName){
        console.log('deleting dir: ' + path.join(this.fullPath, baseName));
    }

    static isA(fullPath) {
        return fs.lstatSync(fullPath).isDirectory();
    }

    static sync_(master, slave, options){
        options = _.defaults(options, {
            stepInto: _.noop
        });

        slave.getSubDirectoriesBaseNames()
            .filter(name => {
                return !master.hasSubDir(name);
            })
            .forEach(name => {
                slave.deleteDir(name);
            });

        master.getSubDirectoriesBaseNames()
            .filter(name => {
                return !slave.hasSubDir(name);
            })
            .forEach(name => {
                slave.createDir(name);
            });
        
        master.getSubDirectoriesBaseNames().forEach(name => {
            options.stepInto()
        });

    }


}

module.exports = Directory;
