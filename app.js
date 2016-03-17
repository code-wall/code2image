"use strict";

var express  	= require('express');
var app      	= express();
var bodyParser 	= require('body-parser');

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/docs'));

require('./api/routes.js')(app);

app.listen(8080);
console.log('WebApp listening on port 8080');