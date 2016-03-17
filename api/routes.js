"use strict";

var API = require("./api-handlers");

module.exports = function(app) {

    app.get("/", API.index);
    app.get("/test", API.test);
    app.get("/image", API.getCode);

    // Redirect all unknown routes to home.
    app.all("*", function(req, res) {
        res.redirect("/");
    });
};