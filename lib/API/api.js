var app 					= require('express')();
var express 			= require('express');
var http 					= require('http').Server(app);
var basic 				= require('express-authentication-basic');
var md5 					= require('md5');
var mysql   			= require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root', 
  password : '1',
  database : 'kospr'
});
 
connection.connect();

var sendmail = require('sendmail')({silent: true});
 
sendmail({
  from: 'no-reply@xonork.com',
  to: 'gerencia@domoteco.com',
  subject: '[Xonork] Regitro de asistencia',
  html: 'Registro de asistencia exitoso:' +new Date(),
}, function(err, reply) {
	console.log(reply);
  console.log(err && err.stack);
  console.dir(reply);
});

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
//http://localhost:4000
app.get('/', function(req, res){
	if (req.authenticated) {		
		res.sendFile(__dirname + '/index.html');		
	} else {
		res.status(401).send();
	}  
});

//http://localhost:4000/users
app.get('/users', function(req, res){		
  	connection.query('SELECT user_id AS id, user_name AS username, user_type AS type, user_date AS date, user_status AS status FROM k_users WHERE 1', function (error, results, fields) {
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

//http://localhost:4000/user/1
app.get('/user/:id', function(req, res){
		var id = req.param('id');
  	connection.query('SELECT user_id AS id, user_name AS username, user_type AS type, user_date AS date, user_status AS status FROM k_users WHERE user_id = '+id, function (error, results, fields) {
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

//http://localhost:4000/user/add/{"username":"judlup","password":"kibitech","email":"judlup@domoteco.com","type":"1"}
app.get('/user/add/:data', function(req, res){
	var data = req.param('data');	
	var json = JSON.parse(data);
	console.log(json.username,json.password,json.type,json.email);	  	
  	connection.query('SELECT user_id AS id FROM k_users WHERE user_name = "'+json.username+'"', function (error, results, fields) {
	  if (error) throw error;	  
	  if(results.length != 0)
	  {
	  	return res.json({add_user:false});		  	
	  }
	  else
	  {
	  	var date = new Date();
	  	var date_format = date.getUTCFullYear()+'-'+date.getUTCMonth()+'-'+date.getUTCDate()+' '+date.getUTCHours()+':'+date.getUTCMinutes()+':'+date.getUTCSeconds();	  	
	  	connection.query('INSERT INTO k_users(user_name,user_pass,user_email,user_date,user_type,user_status) VALUES("'+json.username+'","'+md5(json.password)+'","'+escape(json.email)+'","'+date_format+'","'+json.type+'",1)', function (error_, results_, fields_) {
	  		if (error_) throw error_;	  
	  		return res.json({add_user:true});
	  	});
	  }
	});		
});



http.listen(4000, function(){
  console.log('Kospr API running *:4000');
});