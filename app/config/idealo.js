const common = require('./common'),
    deepAssign = require('deep-assign');

module.exports = deepAssign(common, {
    backup: {
        from: '/home/harrold.korte/Music/caracas_',
        to: '/home/harrold.korte/Music/caracas'
    },
    master: {
        fullPath: '/home/harrold.korte/Music/caracas/master' // 'Y:/Archive/Music/256GB', //
    },
    slave: {
        fullPath: '/home/harrold.korte/Music/caracas/slave'
    },
    storage: {
        dir: '/tmp/node-persist/caracas',
        ttl: true // 24h
    }

});
