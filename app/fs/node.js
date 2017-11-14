'use strict';

const _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    Base = require('../mvc/base'),
    ncp = require('ncp').ncp,
    rimraf = require('rimraf'),
    mix =require('../mvc/mix'),
    Job = require('../batch/job'),
    PersistenceSyncMixin = require('../mvc/persistenceSyncMixin');

class Node extends Base { // FFS: mix(Job).with(PersistenceSyncMixin) {
    get basePath() {
        return path.dirname(this.fullPath);
    }

    get baseName() {
        return path.basename(this.fullPath);
    }
}

module.exports = Node;
