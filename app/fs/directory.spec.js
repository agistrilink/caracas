'use strict';

const Directory = require('./directory'),
    fs = require('fs'),
    rimraf = require('./rimraf');

describe('getSubdirectories on mixed file/dir directory', () => {
    const dirFullPath = '/a/directory',
        readdir = {
            file1: false,
            file2: false,
            dir1: true,
            dir2: true
        };
    let res;

    beforeEach(done => {
        spyOn(fs, 'readdir').and.callFake((_, cb) => {
            cb(undefined, Object.keys(readdir));
        });

        spyOn(fs, 'lstat').and.callFake((fullPath, cb) => {
            const key = fullPath.substring(dirFullPath.length + 1);
            cb(undefined, {isDirectory: _ => readdir[key]});
        });

        new Directory({fullPath: dirFullPath}).getSubDirectories().then(list => {
            res = list;
            done();
        });
    });

    it('should return the directories only', () => {
        expect(res).toEqual([dirFullPath + '/dir1', dirFullPath + '/dir2']);
    });
});

describe('getSubDirectoriesBaseNames on mixed file/dir directory', () => {
    const dirFullPath = '/a/directory',
        readdir = {
            file1: false,
            file2: false,
            dir1: true,
            dir2: true
        };
    let res;

    beforeEach(done => {
        spyOn(fs, 'readdir').and.callFake((_, cb) => {
            cb(undefined, Object.keys(readdir));
        });

        spyOn(fs, 'lstat').and.callFake((fullPath, cb) => {
            const key = fullPath.substring(dirFullPath.length + 1);
            cb(undefined, {isDirectory: _ => readdir[key]});
        });

        new Directory({fullPath: dirFullPath}).getSubDirectoriesBaseNames().then(list => {
            res = list;
            done();
        });
    });

    it('should return the basenames of directories only', () => {
        expect(res).toEqual(['dir1', 'dir2']);
    });
});

describe('getFiles on mixed file/dir directory', () => {
    const dirFullPath = '/a/directory',
        readdir = {
            file1: true,
            file2: true,
            dir1: false,
            dir2: false
        };
    let res;

    beforeEach(done => {
        spyOn(fs, 'readdir').and.callFake((_, cb) => {
            cb(undefined, Object.keys(readdir));
        });

        spyOn(fs, 'lstat').and.callFake((fullPath, cb) => {
            const key = fullPath.substring(dirFullPath.length + 1);
            cb(undefined, {isFile: _ => readdir[key]});
        });

        new Directory({fullPath: dirFullPath}).getFiles().then(list => {
            res = list;
            done();
        });
    });

    it('should return the files only', () => {
        expect(res).toEqual([dirFullPath + '/file1', dirFullPath + '/file2']);
    });
});

describe('deleteDir can only delete dir', () => {
    let res;

    beforeEach(done => {
        spyOn(fs, 'lstat').and.callFake((fullPath, cb) => {
            cb(undefined, {isDirectory: _ => false});
        });

        new Directory({fullPath: 'blabla'}).deleteDir('test').catch(msg => {
            res = msg;
            done();
        });
    });

    it('should give an error message', () => {
        expect(res).toBe('not a directory: blabla/test');
    });
});

describe('deleteDir calls rimraf with fullPath', () => {
    let rimrafFirstParameter;

    beforeEach(done => {
        spyOn(rimraf, 'go').and.callFake((fullPath, cb) => cb());

        spyOn(fs, 'lstat').and.callFake((fullPath, cb) => {
            cb(undefined, {isDirectory: _ => true});
        });

        new Directory({fullPath: 'blabla'}).deleteDir('test').then(__ => {
            const rimrafFirstCall = rimraf.go.calls.first();

            if (rimrafFirstCall && rimrafFirstCall.args.length > 0){
                rimrafFirstParameter = rimrafFirstCall.args[0];
            }

            done();
        });
    });

    it('should supply the fullPath as first parameter to rimraf', () => {
        expect(rimrafFirstParameter).toBe('blabla/test');
    });
});
