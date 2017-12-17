var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'mega_data', 
  password : 'd0m0t3c0.',
  database : 'kospr'
});
 
connection.connect();
 
//Start web server
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/users', function(req, res){		
  	connection.query('SELECT * FROM k_users WHERE 1', function (error, results, fields) {
	  if (error) throw error;
	  if(results.length != 0)
	  {
	  	return res.json(results);
	  }
	  else
	  {
	  	return res.json({user:false});	
	  }
	});	
});

app.get('/user/:id', function(req, res){
		var id = req.param('id');
  	connection.query('SELECT * FROM k_users WHERE user_id = '+id, function (error, results, fields) {
	  if (error) throw error;	  
	  if(results.length != 0)
	  {
	  	return res.json(results);
	  }
	  else
	  {
	  	return res.json({user:false});	
	  }
	});	
});

http.listen(4000, function(){
  console.log('Kospr API running *:4000');
});