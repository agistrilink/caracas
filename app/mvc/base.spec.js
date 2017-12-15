"use strict";

const Base = require('./base');

describe("Base suite", function() {
    it("constrcutor object field will be part of the created object", function() {
        let obj = new Base({field: 1});

        expect(obj.hasOwnProperty('field')).toBe(true);
        expect(obj.field).toBe(1);
    });
});
