
const _ = require('lodash'),
    async = require('async');

class Miracle extends _ {
//    _ = require('lodash'),
    static waterfall(list, done) {
        return new Promise((resolve, reject) => {
            async.waterfall(list, done || ((err, ...data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }));
        });
    }

    // http://macr.ae/article/es6-and-currying.html
    static curry(fn, ...args1) {
        const i = args1.indexOf(Miracle),
            args3 = (i === -1) ? [] : args1.splice(i).slice(1);

        return (...args2) => fn(...args1, ...args2, ...args3);
    }
}

module.exports = Miracle;
