"use strict";

const wkhtml = require("node-wkhtml");
const webshot = require("webshot");
const fs = require("fs");
const ejs = require("ejs");

const codeModes = require("./modes.js").languages;
const helpers = require("./helpers.js");

const CODE_TEMPLATE = ejs.compile(fs.readFileSync(__dirname + '/code.ejs', 'utf8'));
const CODE_MIRR_JS_LIB = fs.readFileSync(__dirname + "/../node_modules/codemirror/lib/codemirror.js");
const CODE_MIRR_CSS_LIB = fs.readFileSync(__dirname + "/../node_modules/codemirror/lib/codemirror.css");
const CODE_MIRR_DEFAULT_LANG = "javascript";
const DEFAULT_WIDTH = 1024;

exports.index = function(req, res) {
    res.sendfile("./docs/index.html");
};

exports.test = function(req, res) {
    res.sendfile("./home.html");
};

/**
 * @api {get} /image Get an image representation of your code
 * @apiName GetCodeImage
 * @apiGroup Imagafiy
 *
 * @apiParam {string} code Mandatory code snippet encoded as a JSON string.
 * @apiParam {string} language=javascript Optional language for which the syntax highlighting will be used.
 * @apiParam {string} width=1024 Optional width of the image to be generated.
 *
 * @apiExample {html} HTML:
 * <img src='http://localhost:8080/image?code="function() {\n\tconsole.log(\"hello world\");\n};"'/>
 *
 * @apiExample {javascript} Javascript:
 *  var myImage = document.getElementById('my-image');
 *  var code = 'function() {\n\tconsole.log("hello world");\n};';
 *  var url = 'http://localhost:8080/image?code=' + JSON.stringify(code);
 *  fetch(url).then(function(response) {
 *      return response.blob();
 *  }).then(function(response) {
 *      var objectURL = URL.createObjectURL(response);
 *      myImage.src = objectURL;
 *  });
 *
 * @apiExample {curl} cURL:
 * curl -G "http://localhost:8080/image" \
 *      --data-urlencode "code=\"function() {\\n\\tconstole.log(\\\"hello world\\\");\\n}\"" \
 *      -o mycode.png
 *
 */
exports.getCode = function(req, res) {
    if (!req.query.code) {
        return res.status(400).send("Please provide code to be turned into an image!");
    }
    console.log("Received code string: ", req.query.code);
    if (!helpers.validCodeString(req.query.code)) {
        return res.status(400).send("Invalid JSON string provided for code. Please ensure it is JSON escaped");
    }

    let language = req.query.language ? req.query.language.toLowerCase() : CODE_MIRR_DEFAULT_LANG;
    if (!codeModes.hasOwnProperty(language)) {
        return res.status(400).send("Unrecognized language parameter");
    }
    let langMode = codeModes[language];

    let width = DEFAULT_WIDTH;
    if (req.query.width) {
        let widthRes = helpers.isValidInt(req.query.width);
        if (!widthRes.valid) {
            return res.status(400).send("Invalid Width Parameter");
        }
        width = widthRes.number;
    }

    let codeHtmlRendered = CODE_TEMPLATE({
        codemirrorJs : CODE_MIRR_JS_LIB,
        codemirrorCss: CODE_MIRR_CSS_LIB,
        code         : req.query.code,
        mode         : langMode.mode,
        mimeType     : langMode.hasOwnProperty("mime") ? langMode.mime : langMode.mimes[0]
    });

    //return res.send(codeHtmlRendered);


    // Now take screen shot with PhantomJS and Webshot
    let webshotOptions = {
        siteType              : "html",
        defaultWhiteBackground: true,
        windowSize            : {
            width : width,
            height: 50
        },
        shotSize              : {
            width : width,
            height: "all"
        },
        renderDelay           : 500
    };

    let renderStream = webshot(codeHtmlRendered, webshotOptions);

    res.setHeader('Content-Type', 'image/png; filename=code.png');

    renderStream.on("end", function() {
        console.log("OK");
    });

    renderStream.pipe(res);
};
