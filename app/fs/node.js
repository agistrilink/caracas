'use strict';

const _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    Base = require('../mvc/base'),
    ncp = require('ncp').ncp,
    rimraf = require('rimraf');

class Node extends Base {
    get basePath() {
        return path.dirname(this.fullPath);
    }

    get baseName() {
        return path.basename(this.fullPath);
    }
}

module.exports = Node;
