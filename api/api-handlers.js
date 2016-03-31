"use strict";

const webshot = require("webshot");
const fs = require("fs");
const ejs = require("ejs");
const fetch = require("node-fetch");

const codeModes = require("./modes.js").languages;
const helpers = require("./helpers.js");

const CODE_TEMPLATE = ejs.compile(fs.readFileSync(__dirname + '/code.ejs', 'utf8'));
const CODE_MIRR_JS_LIB = fs.readFileSync(__dirname + "/../node_modules/codemirror/lib/codemirror.js");
const CODE_MIRR_CSS_LIB = fs.readFileSync(__dirname + "/../node_modules/codemirror/lib/codemirror.css");
const CODE_MIRR_DEFAULT_LANG = "javascript";
const DEFAULT_WIDTH = 1024;
const CODE_BIN_API_GET_ENDPOINT = process.env.CODE_BIN_SNIPPET_ENDPOINT || "http://localhost:8888/snippet/";
const ERR_SNIPPET_NOT_FOUND = "Snippet Not found";

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
 * @apiParam {string} id An id of a codebin snippet. Only specify one of code or id.
 * @apiParam {string} twitterFriendly Whether the image should be cropped and resized to fit nicely as a twitter summary card https://dev.twitter.com/cards/types/summary-large-image
 *
 * @apiExample {html} HTML:
 * <img src='http://api.codebin.it/image?code="function() {\n\tconsole.log(\"hello world\");\n};"'/>
 *
 * @apiExample {javascript} Javascript:
 *  var myImage = document.getElementById('my-image');
 *  var code = 'function() {\n\tconsole.log("hello world");\n};';
 *  var url = 'http://api.codebin.it/image?code=' + JSON.stringify(code);
 *  fetch(url).then(function(response) {
 *      return response.blob();
 *  }).then(function(response) {
 *      var objectURL = URL.createObjectURL(response);
 *      myImage.src = objectURL;
 *  });
 *
 * @apiExample {curl} cURL:
 * curl -G "http://api.codebin.it/image" \
 *      --data-urlencode "code=\"function() {\\n\\tconstole.log(\\\"hello world\\\");\\n}\"" \
 *      -o mycode.png
 *
 */
exports.getCode = function(req, res) {
    let gotCode, langMode, code;
    if (!req.query.code && !req.query.id) {
        return res.status(400).send("Please provide code or a codebin.it ID to be turned into an image");
    } else if (req.query.code) {
        if (!helpers.validCodeString(req.query.code)) {
            return res.status(400).send("Invalid JSON string provided for code. Please ensure it is JSON escaped");
        }
        code = req.query.code;

        let language = req.query.language ? req.query.language.toLowerCase() : CODE_MIRR_DEFAULT_LANG;
        if (!codeModes.hasOwnProperty(language)) {
            return res.status(400).send("Unrecognized language parameter");
        }
        langMode = codeModes[language];
        gotCode = Promise.resolve();
    } else {
        // We have an ID
        gotCode = fetch(CODE_BIN_API_GET_ENDPOINT + req.query.id)
            .then(function(resp) {
                if (resp.status != 200) {
                    throw ERR_SNIPPET_NOT_FOUND;
                } else {
                    return resp.json();
                }
            })
            .then(function(json) {
                langMode = codeModes[json.response.language.toLowerCase()];
                code = JSON.stringify(json.response.snippet);
            })

    }

    gotCode
        .then(function() {
            let twitterFriendly = req.query.twitterFriendly === "true";

            // Calculate Size
            let sizes = helpers.calculateCodeSize(code, twitterFriendly);

            let codeHtmlRendered = CODE_TEMPLATE({
                codemirrorJs : CODE_MIRR_JS_LIB,
                codemirrorCss: CODE_MIRR_CSS_LIB,
                code         : code,
                mode         : langMode.mode,
                mimeType     : langMode.hasOwnProperty("mime") ? langMode.mime : langMode.mimes[0],
                topMargin    : sizes.topMargin,
                leftMargin   : sizes.leftMargin
            });

            //return res.send(codeHtmlRendered);

            // Now take screen shot with PhantomJS and Webshot
            let webshotOptions = {
                siteType              : "html",
                defaultWhiteBackground: true,
                windowSize            : {
                    width : sizes.width + 10,
                    height: sizes.height
                },
                shotSize              : {
                    width : sizes.width,
                    height: sizes.height
                },
                phantomPath           : __dirname + "/../node_modules/phantomjs-prebuilt/bin/phantomjs"
            };

            let renderStream = webshot(codeHtmlRendered, webshotOptions);

            res.setHeader('Content-Type', 'image/png; filename=code.png');

            renderStream.on("end", function() {
                console.log("OK");
            });

            renderStream.pipe(res);
        })
        .catch(function(err) {
            if (err === ERR_SNIPPET_NOT_FOUND) {
                res.status(400).send("Invalid ID Provided please check it is a valid ID");
            } else {
                console.log("Internal Error: ", err);
                res.status(500).send("Internal Error");
            }
        });
};
