'use strict';

const _ = require('lodash'),
    storage = require('node-persist');


/** @mixin, see http://exploringjs.com/es6/ch_classes.html#sec_simple-mixins */
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
const Persistence = Sup => class extends Sup {
    save(data) {
    }

    load(){
        const data = {};

        return data;
    }
};

module.exports = Persistence;
