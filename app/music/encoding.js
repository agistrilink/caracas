'use strict';

const _ = require('lodash'),
    Base = require('../mvc/base'),
    TYPE = {
        MP3: 'mp3',
        FLAC: 'flac',
        WAV: 'wav',
        ANY: 'any',
    };

const map = {};

class Encoding extends Base {
    isAny() {
        return this.type === TYPE.ANY;
    }

    isFlac() {
        return this.type === TYPE.FLAC;
    }

    isMp3() {
        return this.type === TYPE.MP3;
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

    
const KBS192 = new Encoding({type: TYPE.MP3, weight: 10}),
    KBS256 = new Encoding({type: TYPE.MP3, weight: 20}),
    VBR = new Encoding({type: TYPE.MP3, weight: 30}),
    KBS320 = new Encoding({type: TYPE.MP3, weight: 100}),

    F16_44 = new Encoding({type: TYPE.FLAC, weight: 1000}),
    F24_44 = new Encoding({type: TYPE.FLAC, weight: 2000}),
    F24_96 = new Encoding({type: TYPE.FLAC, weight: 3000}),
    F24_192 = new Encoding({type: TYPE.FLAC, weight: 4000}),

    W16_44 = new Encoding({type: TYPE.WAV, weight: 10000}),

    MP3 = new Encoding({type: TYPE.MP3}),
    FLAC = new Encoding({type: TYPE.FLAC}),
    ANY = new Encoding({type: TYPE.ANY});

Object.assign(map, {
    'mp3': MP3,
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
    FLAC: FLAC,
    ANY: ANY,
    KBS320: KBS320
};
