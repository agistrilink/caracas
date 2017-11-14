'use strict';

const Base = require('./base'),
    mix = require('./mix'),
    PersistenceSyncMixin = require('./persistenceSyncMixin');

class PersistenceSync extends mix(Base).with(PersistenceSyncMixin) {
}

module.exports = PersistenceSync;
