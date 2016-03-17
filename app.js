"use strict";

var express  	= require('express');
var app      	= express();
var bodyParser 	= require('body-parser');

app.set('view engine', 'ejs');
app.set('views', __dirname);
app.set('port', (process.env.PORT || 8080));

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/docs'));

require('./api/routes.js')(app);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});