"use strict";

const _ = require('./kraftaverk');
/*

describe("Start suite", function() {
    it("contains spec with an expectation", __ => {
        expect(true).toBe(true);
    });
});
*/

describe("Test suite", function() {
    beforeEach(_.newResolved);

    it('test test', () => {
        expect(true).toBe(true);
    });
});

describe("Kraftaverk suite: newResolved", function() {
    const promise = _.Promise.newResolved('test');

    it('should already been resolved', (done) => {
        _.Promise.state(promise).then(state => {
            expect(state).toBe('fulfilled');
            done();
        });
    });
});

describe("Kraftaverk suite: Promise.chain", function() {
    const promise = _.Promise.chain([]);
    let res;

/*
    beforeEach(done => {
        promise.then(data => {
            console.log('boe');
            res = data;
            done();
        })
    });
*/

    beforeEach(() => {
        return new Promise(resolve => {
            promise.then(data => {
                res = data;
                resolve(data);
            });
        });
    });

    it('default parameters on empty list', () => {
        expect(promise instanceof Promise).toBe(true);
        expect(res).toEqual([]);
    });
});
