
"use strict";

const MAX_WIDTH = 3000;
const MIN_WIDTH = 50;

exports.validCodeString = function(code) {
    try {
        let jsonStr = JSON.parse(code);
        if (typeof jsonStr !== "string" ){
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
};

exports.isValidInt = function(numberStr) {
    let valid = true;
    let number = parseInt(numberStr, 10);
    if (isNaN(number) || number < MIN_WIDTH || number > MAX_WIDTH) {
       valid = false;
    }
    return {valid: valid, number: number}
};
