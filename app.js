

var express = require('express');
var app = express(); // declares express app
var mongoose = require('mongoose');


var port = process.env.PORT || 8887; //sets the port to listen on

app.use("/style", express.static(__dirname + '/style'));
app.use("/script", express.static(__dirname + '/script'));

app.use(express.static('/node_modules'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));


/*
=====================================================
	ROUTES
=====================================================
*/



//pages
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/players', function(req, res) {
	res.sendFile(__dirname + '/views/players.html');
});

app.get('/stats', function(req, res) {
	res.sendFile(__dirname + '/views/stats.html');
});

app.get('/news', function(req, res) {
	res.sendFile(__dirname + '/views/news.html');
});

app.get('/rules', function(req, res) {
	res.sendFile(__dirname + '/views/rules.html');
});

app.get('/submit', function(req, res) {
	res.sendFile(__dirname + '/views/submit.html');
});


//start server
app.listen(port, function() {
	console.log("Now listening on port " + port);
});
