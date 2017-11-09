'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('../fs/directory'),
    Encoding = require('./encoding');

class Album extends Directory {
    constructor(obj, options){
        super(obj, options);
    }

    get encoding() {
        return new Encoding(this.fullPath.split(' ').splice(-1));
    }

    get title(){
        const splitted = this.fullPath.split(' ');

        splitted.splice(-1);

        return splitted.join(' ');
    }
};

module.exports = Album;
