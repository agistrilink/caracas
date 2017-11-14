const common = require('./common'),
    deepAssign = require('deep-assign');

module.exports = deepAssign(common, {
    master: {
        fullPath: 'X:/VHE/Music/caracas/master' // 'Y:/Archive/Music/256GB', //
    },
    slave: {
        fullPath: 'X:/VHE/Music/caracas/slave'
    },
    storage: {
        dir: 'X:/VHE/tmp/node-persist/caracas',
        ttl: true // 24h
    }
});
