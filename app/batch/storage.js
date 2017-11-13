'use strict';

const _ = require('lodash'),
    storage = require('node-persist');


/** @mixin, see http://exploringjs.com/es6/ch_classes.html#sec_simple-mixins */
const Persistent = Sup => class extends Sup {
    save(data) {

    }

    load(){
        const data = {};

        return data;
    }
};

module.exports = Persistent;
