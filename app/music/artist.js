'use strict';

const _ = require('lodash'),
    path = require('path'),
    Directory = require('./directory');

class Artist extends Directory {
    constructor(obj, options){
        super(obj, options);
    }

    static sync(master, slave){
        console.log('Artist.sync');
    }
};

module.exports = Artist;
