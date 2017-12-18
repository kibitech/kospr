var app 	= require('express')();
var express = require('express');
var http 	= require('http').Server(app);
var basic 		= require('express-authentication-basic');
var md5 	= require('md5');
var mysql   = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root', 
  password : '1',
  database : 'kospr'
});
 
connection.connect();

var pass = md5('admin');
console.log(pass);

//curl http://localhost:4000/ -u admin
var login = basic(function(challenge, callback) {
	connection.query('SELECT user_name AS username, user_pass AS password, user_type AS type FROM k_users WHERE user_name = "'+challenge.username+'"', function (error, results, fields) {
	  if (error) throw error;	  
		if(results.length != 0)
		{
			if (challenge.username === results[0].username && md5(challenge.password) === results[0].password ) {
				callback(null, true, { username: results[0].username, type: results[0].type });
			} else {
				callback(null, false, { error: 'INVALID_PASSWORD' });
			}
		}
		else
		{
			callback(null, false, { error: 'INVALID_USERNAME' });
		}
	});	
});;

app.use(login); 
 
//Start web server
app.get('/', function(req, res){
	if (req.authenticated) {		
		res.sendFile(__dirname + '/index.html');		
	} else {
		res.status(401).send();
	}  
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
	  	if(results[0].user_pass == pass)
	  	{
	  		console.log("login");
	  	}
	  	else
	  	{
	  		console.log("no login");
	  	}
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

app.get('/user/add/:data', function(req, res){
	var data = req.param('data');	
	var json = JSON.parse(data);
	console.log(json.username,json.pass);	  	
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