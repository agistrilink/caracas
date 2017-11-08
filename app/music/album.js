'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('./directory');

class Album extends Directory {
    constructor(obj, options){
        super(obj, options);
    }

    get encoding() {
        return this.fullPath.split(' ').splice(-1);
    }

};

module.exports = Album;
