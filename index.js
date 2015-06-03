// index.js
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(__dirname));

                       
app.get('/', function(req, res) {
	res.send('static server call direct file');
});

app.listen(2700);
console.log('Server started on http://localhost:2700');