'use strict';

const Base = require('./base'),
    mix = require('./mix'),
    Miracle = require('./miracle'),
    PersistenceSyncMixin = require('./persistenceSyncMixin');

class PersistenceSync extends Miracle.mix(Base).with(PersistenceSyncMixin) {
}

module.exports = PersistenceSync;
