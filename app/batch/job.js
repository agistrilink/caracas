'use strict';

const _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    Base = require('../mvc/base'),
    ncp = require('ncp').ncp,
    rimraf = require('rimraf');

class Job extends Base {
    get basePath() {
        return path.dirname(this.fullPath);
    }

    get baseName() {
        return path.basename(this.fullPath);
    }
}

class JobList extends Job {

}
module.exports = {
    Job: Job
};
