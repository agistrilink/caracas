'use strict';

const _ = require('../mvc/kraftaverk'),
    fs = require('fs');

module.exports = {
    lstat: (...args) => _.promisy(fs.lstat).call(fs, ...args),
    readdir: (...args) => _.promisy(fs.readdir).call(fs, ...args),
    mkdir: (...args) => _.promisy(fs.mkdir).call(fs, ...args)
};
