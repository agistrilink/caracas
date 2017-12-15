"use strict";

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

    static promisy(f, obj){
        return _.curry(_.asPromise, !!obj ? _.bind(f, obj) : f);
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

    static not(f){
        return (...args) => {
            return !f(...args);
        }
    }
}

_.Promise = {
    chain_: (list, worker) => {
        if (list.length === 0){
            return _.newResolved();
        }

        const elt = list.shift();

        return _.Promise.chain(list).then(_.curry(worker, elt));
    },
    chain__: (list, worker, initial) => {
        if (list.length === 0){
            return _.newResolved(initial);
        }

        const elt = list.pop();

        return _.Promise.chain(list, worker, initial).then(_.curry(worker, elt));
    },
    // LOADS of usage options in this chain
    chain: (list, options, worker) => {
        // (list, worker, options) call
        if (typeof options === 'function'){
            [options, worker] = [worker || {}, options];
            options.worker = worker;
        }

        // default chain just constructs an array with no delay and no processing on items
        options = _.defaults(options, {
            worker: elt => _.newResolved(elt),
            delay: undefined,
            reduce: (values, value) => {
                values.push(value);
                return values;
            },
            initial: []
        });

        if (list.length === 0){
            return _.newResolved(options.initial);
        }

        const elt = list.pop();

        return _.Promise.chain(list, options).then(values => {
            return new Promise((resolve, reject) => {
                options.worker(elt).then(value => {
                    values = options.reduce(values, value);

                    if (isNaN(options.delay)){
                        return resolve(values);
                    }

                    setTimeout(_.curry(resolve, values), +options.delay);
                });
            });
        });
    },
    reduce: (list, worker, memo) => {
        if (list.length === 0){
            return _.newResolved(memo);
        }

        const elt = list.pop();

        return _.Promise.reduce(list, worker, memo)
            .then(_.curry(worker, _, elt));
    },
    all: (list, worker) => {
        return Promise.all(list.map(worker));
    }};

_.Promise.each = _.Promise.chain;
module.exports = _;
