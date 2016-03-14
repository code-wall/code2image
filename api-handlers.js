"use strict";

var wkhtml = require("node-wkhtml");
var webshot = require("webshot");
var fs = require("fs");


exports.index = function(req, res) {
    res.sendfile("./code.html");
};

exports.getCode = function(req, res) {
    var options = {
        //siteType: "html"
        defaultWhiteBackground: true,
        windowSize: {
            width: 500,
            height: 50
        },
        shotSize: {
            width: "500",
            height: "all"
        },
    };
    var renderStream = webshot("http://localhost:8080/", options);

    res.setHeader('Content-Type', 'image/png;; filename=code.png');

    renderStream.on("end", function() {
        console.log("OK");
    });

    renderStream.pipe(res);
};
