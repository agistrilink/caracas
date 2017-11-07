'use strict';

const _ = require('lodash'),
    path = require('path'),
    Base = require('../mvc/base');

class Album extends Base {
    constructor(obj, options){
        super(obj, options);
    }

    get encoding() {
        return this.fullPath.split(' ').splice(-1);
    }

    get basePath() {
        return path.dirname(this.fullPath);
    }

    get name() {
        return path.basename(this.fullPath);
    }
};

module.exports = Album;
