'use strict';

const _ = require('../mvc/kraftaverk'),
    fs = require('./promisy'),
    path = require('path'),
    File = require('./file'),
    Node = require('../fs/node'),
    _ncp = _.promisy(require('ncp').ncp),
    _fsStat = _.promisy(fs.stat),
    _fsMkdir = _.promisy(fs.mkdir),
    _fsReaddir = _.promisy(fs.readdir),
    rimraf = require('./rimraf'),
    _rimraf = _.promisy(rimraf);

class Directory extends Node {
    hasSubDir(baseName, options){
        return this.getSubDirectoriesBaseNames(options).then(baseNameList => {
            return Promise.resolve(baseNameList.indexOf(baseName)) > -1;
        });
    }

    // https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
    getSubDirectories(options){
        return fs.readdir(this.fullPath).then(list => {
            return _.Promise.chain(list, {
                worker: baseName => new Node({fullPath: this.fullPath + '/' + baseName}).isDirectory(),
                reduce: (subDirectories, isDirectory, baseName) => {
                    if (isDirectory) {
                        subDirectories.push(this.fullPath + '/' + baseName);
                    }

                    return subDirectories;
                }
            });
        });
    }

    getFiles(){
        return fs.readdir(this.fullPath)
//            .then(list => Promise.resolve(list.map(baseName => this.fullPath + '/' + baseName)))
            .then(_.Promise.MapSync(baseName => this.fullPath + '/' + baseName))
//            .then(list => _.Promise.filter(list, fullPath => new Node({fullPath}).isFile()))
            .then(_.Promise.Filter(fullPath => new Node({fullPath}).isFile()))
            ;
    }

    getSubDirectoriesBaseNames(options) {
        return this.getSubDirectories(options)
            .then(_.Promise.MapSync(fullPath => path.basename(fullPath)));
    }
    
    createDir(baseName){
        const fullPath = path.join(this.fullPath, baseName);

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

    static copyDir(from, to){
        return _ncp(from, to, {limit: 1});
    }

    deleteDir(baseName){
        const fullPath = this.fullPath + '/' + baseName;

        return new Node({fullPath}).isDirectory().then(
            isDirectory => isDirectory
                ? _.promisy(rimraf.go).call(undefined, fullPath)
                : Promise.reject('not a directory: ' + fullPath)
        );
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
