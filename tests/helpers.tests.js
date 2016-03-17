"use strict";

const chai = require("chai");
const expect = chai.expect;

const helpers = require("../api/helpers.js");

// Test Data
const CODE_INPUT = [
    {
        input: 'test',
        valid: false
    },
    {
        input: '"test"',
        valid: true
    },
    {
        input: '"1 hello \\\\ \\n"',
        valid: true
    },
    {
        input: 'null',
        valid: false
    },
    {
        input: '"null"',
        valid: true
    },
    {
        input: '123',
        valid: false
    },
    {
        input: '{"test": "hello"}',
        valid: false
    },
    {
        input: 'true',
        valid: false
    },
    {
        input: '[1,2,3,4]',
        valid: false
    }

];
describe("Helpers tests", function() {
    it("Should output correct code for input", function() {
        for (let test of CODE_INPUT) {
            let valid = helpers.validCodeString(test.input);
            expect(valid).to.equal(test.valid);
        }
    });

    it("Should correctly identify ints", function() {
        expect(helpers.isValidInt("50").valid).to.be.true;
        expect(helpers.isValidInt("50").number).to.equal(50);
        expect(helpers.isValidInt("false").valid).to.be.false;
        expect(helpers.isValidInt({}).valid).to.be.false;
        expect(helpers.isValidInt("-10").valid).to.be.false;
        expect(helpers.isValidInt("3001").valid).to.be.false;
        expect(helpers.isValidInt("2999").valid).to.be.true;
    })
});