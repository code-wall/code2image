"use strict";

const wkhtml = require("node-wkhtml");
const webshot = require("webshot");
const fs = require("fs");
const ejs = require("ejs");

const codeModes = require("./modes.js").languages;

const CODE_TEMPLATE = ejs.compile(fs.readFileSync(__dirname + '/code.ejs', 'utf8'));
const CODE_MIRR_JS_LIB = fs.readFileSync(__dirname + "/node_modules/codemirror/lib/codemirror.js");
const CODE_MIRR_CSS_LIB = fs.readFileSync(__dirname + "/node_modules/codemirror/lib/codemirror.css");
const CODE_MIRR_DEFAULT_LANG = "javascript";

exports.index = function(req, res) {
    if (!req.query.code) {
        return res.status(400).send("Please provide code to be turned into an image!");
    }
    let code = JSON.stringify(req.query.code);
    console.log("Code: ", code);
    code = code.slice(1, code.length - 1);
    code = code.replace(/\\\\n/g, "\\n")
               .replace(/\\\\t/g, "\\t");
    console.log("code: ", code);

        console.log("New code: ", code);
    let language = req.query.language ? req.query.language.toLowerCase() : CODE_MIRR_DEFAULT_LANG;
    if (!codeModes.hasOwnProperty(language)) {
        return res.status(400).send("Unrecognized language parameter");
    }
    let langMode = codeModes[language];

    res.send(CODE_TEMPLATE({
        codemirrorJs : CODE_MIRR_JS_LIB,
        codemirrorCss: CODE_MIRR_CSS_LIB,
        code         : code,
        mode         : langMode.mode,
        mimeType     : langMode.hasOwnProperty("mime") ? langMode.mime : langMode.mimes[0]
    }));
};

exports.getCode = function(req, res) {
    let code = req.query.code;
    code = code.replace(new RegExp("\"", 'g'), "\\\"");

    let rendered = CODE_TEMPLATE({
        codemirrorJs : CODE_MIRR_JS_LIB,
        codemirrorCss: CODE_MIRR_CSS_LIB,
        code         : code
    });



    // Now take screen shot with PhantomJS and Webshot
    let webshotOptions = {
        siteType: "html",
        defaultWhiteBackground: true,
        windowSize: {
            width: 500,
            height: 50
        },
        shotSize: {
            width: "500",
            height: "all"
        },
        renderDelay: 500
    };

    let renderStream = webshot(rendered, webshotOptions);

    res.setHeader('Content-Type', 'image/png; filename=code.png');

    renderStream.on("end", function() {
        console.log("OK");
    });

    renderStream.pipe(res);
};
