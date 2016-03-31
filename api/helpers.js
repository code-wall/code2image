"use strict";

const MAX_WIDTH = 3000;
const MIN_WIDTH = 50;

const TAB_LENGTH = 2;
const LINE_HEIGHT = 24;
const CHAR_WIDTH = 12;
const BODY_DEFAULT_MARGIN = 100;


exports.validCodeString = function(code) {
    try {
        let jsonStr = JSON.parse(code);
        if (typeof jsonStr !== "string") {
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

exports.calculateLineLengths = function(jsonStr) {
    let codeString = JSON.parse(jsonStr);
    // Replace tabs
    codeString = codeString.replace("\t", "--");
    let lineSplit = codeString.split(/\n/);
    // Sort
    lineSplit.sort((line1, line2) => {
        return line2.length - line1.length;
    });

    console.log("Number Lines: ", lineSplit[0].length);
    return {
        numLines         : lineSplit.length,
        longestLineLength: lineSplit[0].length
    }
};


exports.calculateCodeSize = function(jsonStr, twitterFriendly) {
    let lengths = exports.calculateLineLengths(jsonStr);
    let codeWidth = lengths.longestLineLength * CHAR_WIDTH;
    let codeHeight = lengths.numLines * LINE_HEIGHT;
    if (!twitterFriendly) {
        return {
            width           : codeWidth + (2 * BODY_DEFAULT_MARGIN),
            height          : codeHeight + (2 * BODY_DEFAULT_MARGIN),
            verticalMargin  : BODY_DEFAULT_MARGIN,
            horizontalMargin: BODY_DEFAULT_MARGIN
        }
    }
};


