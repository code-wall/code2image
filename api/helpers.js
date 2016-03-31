"use strict";

const MAX_WIDTH = 3000;
const MIN_WIDTH = 50;

const TAB_LENGTH = 2;
const LINE_HEIGHT = 24;
const CHAR_WIDTH = 12;
const BODY_DEFAULT_MARGIN = 8;

const TWITTER_WIDTH = 560;
const TWITTER_HEIGHT = 300;

const FACEBK_WIDTH = 1200;
const FACEBK_HEIGHT = 630;


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


exports.calculateCodeSize = function(jsonStr, twitterFriendly, facebookFriendly) {
    let lengths = exports.calculateLineLengths(jsonStr);
    let codeWidth = lengths.longestLineLength * CHAR_WIDTH;
    let codeHeight = lengths.numLines * LINE_HEIGHT;
    if (!twitterFriendly && !facebookFriendly) {
        return {
            width     : codeWidth + (2 * BODY_DEFAULT_MARGIN),
            height    : codeHeight + (2 * BODY_DEFAULT_MARGIN),
            topMargin : BODY_DEFAULT_MARGIN,
            leftMargin: BODY_DEFAULT_MARGIN
        }
    } else {
        let height, width, leftMargin, topMargin;
        let requiredHeight = twitterFriendly ? TWITTER_HEIGHT : FACEBK_HEIGHT;
        let requiredWidth =  twitterFriendly ? TWITTER_WIDTH : FACEBK_WIDTH;
        // We always get the entire width of the code in but not always the entire height
        if (codeWidth > requiredWidth) {
            width = codeWidth;
            leftMargin = 0;
            let proportions = codeWidth / requiredWidth;
            let desiredHeight = requiredHeight * proportions;
            if (desiredHeight > codeHeight) {
                topMargin = (desiredHeight - codeHeight) / 2;
            } else {
                topMargin = 0;
            }
            height = desiredHeight;
        } else {
            width = requiredWidth;
            leftMargin = (requiredWidth - codeWidth) / 2;
            height = requiredHeight;
            if (codeHeight < requiredHeight) {
                topMargin = (requiredHeight - codeHeight) / 2;
            } else {
                topMargin = 0;
            }
        }
        return {
            width     : width,
            height    : height,
            topMargin : topMargin,
            leftMargin: leftMargin
        }
    }
};


