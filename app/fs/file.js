'use strict';

const fs = require('fs'),
    _ = require('../mvc/miracle'),
    Node = require('../fs/node'),
    _fsCopyFile = _.promisy(fs.copyFile);

class File extends Node {
    static isA(fullPath) {
        return fs.lstatSync(fullPath).isFile();
    }

    static copyFile(from, to) {
        return _fsCopyFile(from, to);
    }
}

module.exports = File;
