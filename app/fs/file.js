'use strict';

const fs = require('fs'),
    Node = require('../fs/node');

class File extends Node {
    static isA(fullPath) {
        return fs.lstatSync(fullPath).isFile();
    }
}

module.exports = File;
