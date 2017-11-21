
const lodash = require('lodash'),
    async = require('async');

class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }

    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}

class _ extends lodash {
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

    static queue(list, worker, options) {
        return new Promise((resolve, reject) => {
            options = _.defaults(options, {
                drain: (err, ...data) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
                concurrency: 20
            });

            const q = async.queue(worker, options.concurrency);
            q.drain = options.drain;
            q.push(list);
        });
    }

    static asPromise(f, ...args){
        return new Promise((resolve, reject) => {
            f(...args, (err, ...data) => {
                if (err){
                    return reject(err);
                }
                resolve(...data);
            });
        });
    }

    static promisy(obj, f){
        if (!f){
            return _.curry(_.asPromise, obj);
        }

        if (typeof f === 'string'){
            f = obj[f];
        }

        return _.curry(_.asPromise, _.bind(f, obj));
    }

    static newResolved(...args){
        return new Promise((resolve) => {
            resolve(...args);
        });
    }

    // http://macr.ae/article/es6-and-currying.html
    static curry(fn, ...args1) {
        const i = args1.indexOf(_),
            args3 = (i === -1) ? [] : args1.splice(i).slice(1);

        return (...args2) => fn(...args1, ...args2, ...args3);
    }

    static mix(superclass) {
        return new MixinBuilder(superclass);
    }
}

module.exports = _;
