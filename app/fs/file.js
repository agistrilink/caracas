'use strict';

const _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    Node = require('../fs/node'),
    ncp = require('ncp').ncp,
    rimraf = require('rimraf');

class File extends Node {
    static isA(fullPath) {
        return fs.lstatSync(fullPath).isFile();
    }
}

module.exports = File;
