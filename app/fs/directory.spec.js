'use strict';

const Directory = require('./directory'),
    fs = require('fs');

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
