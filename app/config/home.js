const common = require('./common'),
    deepAssign = require('deep-assign'),
    config= deepAssign(common, {
        backup: {
            from: 'X:/VHE/Music/caracas_',
            to: 'X:/VHE/Music/caracas'
        },
        master: {
            fullPath: 'Y:/Archive/Music/256GB' //'X:/VHE/Music/caracas/master' //
        },
        slave: {
            fullPath: 'F:/Music' //'X:/VHE/Music/caracas/slave'
        },
        storage: {
            dir: 'X:/VHE/tmp/node-persist/caracas',
            ttl: true // 24h
        }
    });

config.sync = {
    skip: {
        artist: [
//            'Durandal'
        ],
        album: [
//            'Safa.Ri - (2016) Trumpa Nine-Eleven 320kbs'
        ]
    }
}

module.exports = config;