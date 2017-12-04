

var express = require('express');
var app = express(); // declares express app
var mongoose = require('mongoose');


var port = process.env.PORT || 4000; //sets the port to listen on

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

app.get('/home', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/entrants', function(req, res) {
	res.sendFile(__dirname + '/views/entrants.html');
});


//start server
app.listen(port, function() {
	console.log("Now listening on port " + port);
});
