'use strict';

const _ = require('../mvc/kraftaverk'),
    fs = require('./promisy'),
    path = require('path'),
    Base = require('../mvc/base')/*,
    mix =require('../mvc/mix'),
    Job = require('../batch/job'),
    PersistenceSyncMixin = require('../mvc/persistenceSyncMixin')*/;

class Node extends Base { // FFS: mix(Job).with(PersistenceSyncMixin) {
    constructor(obj) {
        super(obj);

        if (!this.fullPath) {
            throw 'missing field \'fullPath\' for Node instance';
        }
    }

    get basePath() {
        return path.dirname(this.fullPath);
    }

    get baseName() {
        return path.basename(this.fullPath);
    }

    isDirectory() {
        return fs.lstat(this.fullPath)
            .then(stats => Promise.resolve(stats.isDirectory()));
    }

    isFile() {
        return new Promise((resolve, reject) => fs.lstat(
            this.fullPath, (err, stats) => err ? reject(err) : resolve(stats.isFile()))
        )
    }
}

module.exports = Node;
