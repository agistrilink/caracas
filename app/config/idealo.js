const common = require('./common'),
    deepAssign = require('deep-assign');

module.exports = deepAssign(common, {
    backup: {
        from: '/home/harrold.korte/Music/caracas_',
        to: '/home/harrold.korte/Music/caracas'
    },
    master: {
//        fullPath: '/run/user/1001/gvfs/mtp:host=%5Busb%3A002%2C016%5D/sdcard1/Music',
        fullPath: '/home/harrold.korte/Music/caracas/master'
    },
    slave: {
        fullPath: '/home/harrold.korte/Music/caracas/slave'
    },
    storage: {
        dir: '/tmp/node-persist/caracas',
        ttl: true // 24h
    }

});
