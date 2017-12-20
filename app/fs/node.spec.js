'use strict';

const Node = require('./node'),
    fs = require('fs'),
    path = require('path');

describe('get basePath', () => {
    it('should return dirname', () => {
        const node = new Node({fullPath: '/'});

        spyOn(path, 'dirname').and.returnValue('blabla');

        expect(node.basePath).toBe('blabla');
    });
});

describe('get baseName', () => {
    it('should return dirname', () => {
        const node = new Node({fullPath: '/'});

        spyOn(path, 'basename').and.returnValue('blabla');

        expect(node.baseName).toBe('blabla');
    });
});

describe('isDirectory reflects stats.isDirectory value', () => {
    let isDirectory;

    beforeEach(done => {
        spyOn(fs, 'lstat').and.callFake((_, cb) => {
            const stats = {isDirectory: _ => 'a boolean value'};
            cb(undefined, stats);
        });

        new Node({fullPath: 'blabla'}).isDirectory().then(value => {
            isDirectory = value;
            done();
        });
    });

    it('should be true for a directory', () => {
        expect(isDirectory).toBe('a boolean value');
    });
});
