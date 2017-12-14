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
    chain: (list, worker, initial) => {
        if (list.length === 0){
            return _.newResolved([]);
        }

        const elt = list.pop();

/*
        return new Promise((resolve, reject) => {
            _.Promise.chain(list, worker)
                .then(values => {
                    worker(elt).then(value => {
                        values.push(value);
                        resolve(values);
                    });
                });
        });
*/

        return _.Promise.chain(list, worker).then(values => {
            return new Promise((resolve, reject) => {
                worker(elt).then(value => {
                    values.push(value);
                    resolve(values);
                });
            });
        });
    },
    all: (list, worker, initial) => {
        return Promise.all(list.map(worker));
    }};

module.exports = _;
