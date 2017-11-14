'use strict';

const _ = require('lodash'),
    config = require('../config/config'),
    Storage = require('node-persist'),
    storage = Storage.create(config.storage),

    /** @mixin, see http://exploringjs.com/es6/ch_classes.html#sec_simple-mixins */
    // http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
    PersistenceSyncMixin = Sup => class extends Sup {
        save(key, value) {
            storage.setItemSync(key, value);
        }

        load(key, options){
            options = _.defaults(options, {
                isDoThrowOnNotFound: true
            });

            const value = storage.getItemSync(key);

            if (value === undefined && options.isDoThrowOnNotFound) {
                throw key + ' not found in storage'
            }

            return value;
        }

        remove(key){
            storage.removeItemSync(key);
        }
    };

storage.initSync();

module.exports = PersistenceSyncMixin;
