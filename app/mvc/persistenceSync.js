'use strict';

const Base = require('./base'),
    mix = require('./mix'),
    Kraftaverk = require('./kraftaverk'),
    PersistenceSyncMixin = require('./persistenceSyncMixin');

class PersistenceSync extends Kraftaverk.mix(Base).with(PersistenceSyncMixin) {
}

module.exports = PersistenceSync;
