'use strict';

const _ = require('../mvc/kraftaverk'),
    fs = require('fs'),
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
        // do this here for testing (otherwise fs.lstat cannot be mocked)
        const _fsLstat = _.promisy(fs.lstat, fs);

        return _fsLstat(this.fullPath).then(stats => Promise.resolve(stats.isDirectory()));
    }
}

module.exports = Node;
