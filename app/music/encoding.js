'use strict';

const _ = require('lodash'),
    Base = require('../mvc/base'),

    // encoding types
    MP3 = 'mp3',
    FLAC = 'flac',
    WAV = 'wav',
    ANY = 'any';

const map = {};

class Encoding extends Base {
    isAny() {
        return this.type === Encoding.ANY;
    }

    isFlac() {
        return this.type === Encoding.FLAC;
    }

    isMp3() {
        return this.type === Encoding.MP3;
    }

    static compare(a, b){
        if (a.weight === b.weight){
            return 0;
        }

        return a.weight > b.weight ? 1 : -1;
    }

    static getFromKey(key) {
        const encoding = map[key];

        if (!encoding){
            throw 'unknown file extension: ' + key;
        }

        return encoding;
    }
}

    
const KBS192 = new Encoding({type: MP3, weight: 10}),
    KBS256 = new Encoding({type: MP3, weight: 20}),
    VBR = new Encoding({type: MP3, weight: 30}),
    KBS320 = new Encoding({type: MP3, weight: 100}),

    F16_44 = new Encoding({type: FLAC, weight: 1000}),
    F24_44 = new Encoding({type: FLAC, weight: 2000}),
    F24_96 = new Encoding({type: FLAC, weight: 3000}),
    F24_192 = new Encoding({type: FLAC, weight: 4000}),

    W16_44 = new Encoding({type: 'wav', weight: 10000});

Object.assign(map, {
    '192kbs': KBS192,
    '256kbs': KBS256,
    'vbr': VBR,
    '320kbs': KBS320,

    'flac': F16_44,
    '24-44': F24_44,
    '24-96': F24_96,
    '24-192': F24_192,

    'wav': W16_44
});

module.exports = {
    Encoding: Encoding,
    MP3: MP3,
    ANY: ANY,
    KBS320: KBS320
};
