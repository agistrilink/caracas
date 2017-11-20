'use strict';

const _ = require('../mvc/miracle'),
    fs = require('fs'),
    path = require('path'),
    File = require('./file'),
    Node = require('../fs/node'),
    ncp = require('ncp').ncp,
    rimraf = require('rimraf');

class Directory extends Node {
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

    getFiles(options){
        options = _.defaults(options, {
            force: false
        });

        if (this.files && !options.force){
            return this.files;
        }

        return this.files = fs.readdirSync(this.fullPath)
            .map(baseName => path.join(this.fullPath, baseName))
            .filter(File.isA);
    }

    getSubDirectoriesBaseNames(options) {
        return this.getSubDirectories(options)
            .map(fullPath => {return path.basename(fullPath)});
    }
    
    createDir(baseName){
        const fullPath = path.join(this.fullPath, baseName),
            _fsStat = _.promisy(fs.stat),
            _fsMkdir = _.promisy(fs.mkdir);

        return new Promise((resolve, reject) => {
            _fsStat(fullPath)
                .then(stats => {
                    if (stats.isDirectory()){
                        resolve(fullPath);
                    } else {
                        reject(fullPath + ' is not a directory');
                    }
                })
                .catch(__ => {
                    _fsMkdir(fullPath)
                        .then(__ => {
                            resolve(fullPath);
                        })
                        .catch(reject);
                });
        });
    }

    static copyDir(from, to , cb){
        const _ncp = _.promisy(ncp);

        return _ncp(from, to);
    }

    deleteDir(baseName){
        const _rimraf = _.promisy(rimraf),
            fullPath = path.join(this.fullPath, baseName);

        return _rimraf(fullPath);
    }

    static isA(fullPath) {
        return fs.lstatSync(fullPath).isDirectory();
    }

    // FFS
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
