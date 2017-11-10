'use strict';

const _ = require('lodash'),
    F24_96 = '24-96',
    FLAC = 'flac',
    KBS320 = '320kbs',
    KBS256 = '256kbs',
    KBS192 = '192kbs',
    VBR = 'vbr',
    quality = {
        KBS192: 10,
        KBS256: 20,
        VBR: 30,
        KBS320: 40,
        FLAC: 100,
        F24_96: 500,
        F24_192: 900,
        WAV: 2000
    }

class Encoding extends String {
    static compare(a, b){
        const qA = quality[a.getValue()],
            qB = quality[b.getValue()];

        if (qA === qB){
            return 0;
        }

        return qA > qB ? 1 : -1;
    }

    isFlac() {
        const value = this.valueOf();

        return quality[value] >= FLAC;
    }
}

module.exports = Encoding;
