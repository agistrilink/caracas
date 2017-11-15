const common = require('./common'),
    deepAssign = require('deep-assign');

module.exports = deepAssign(common, {
    backup: {
        from: 'X:/VHE/Music/caracas_',
        to: 'X:/VHE/Music/caracas'
    },
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
