var app 				= require('express')();
var express 			= require('express');
var http 				= require('http').Server(app);
var basic 				= require('express-authentication-basic');
var md5 				= require('md5');
var cors 				= require('cors')
var mysql   			= require('mysql');

var connection = mysql.createConnection({
  host     : 'sql10.freemysqlhosting.net',
  user     : 'sql10211351', 
  password : 'ZSxFArywMm',
  database : 'sql10211351'
});
 
connection.connect();

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

app.use(cors())
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
	//console.log(json.username,json.password,json.type,json.email);	  	
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

//http://localhost:4000/segments
app.get('/segments', function(req, res){		
  	connection.query('SELECT s.segment_id AS id, segment_name AS name, segment_date AS date, segment_status AS status FROM k_segments s WHERE segment_status = 1', function (error, results, fields) {
	  if (error) throw error;
	  if(results.length != 0)
	  {	  	
	  	return res.json(results);
	  }
	  else
	  {
	  	return res.json({segments:false});	
	  }
	});	
});

//http://localhost:4000/segment/add/{"name":"Center"}
app.get('/segment/add/:data', function(req, res){	
	var data = req.param('data');	
	var json = JSON.parse(data);
	var date = new Date();
  	var date_format = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();	    
  	connection.query('INSERT INTO k_segments(segment_name,segment_date,segment_status) VALUES("'+json.name+'","'+date_format+'",1)', function (error, results, fields) {
	  if (error) throw error;
	  if(error)
	  {	  	
	  	return res.json({segment_add:false});
	  }
	  else
	  {
	  	return res.json({segment_add:true});	
	  }
	});	
});

//http://localhost:4000/segment/edit/{"id":"2","name":"Center-"}
app.get('/segment/edit/:data', function(req, res){	
	var data = req.param('data');	
	var json = JSON.parse(data);	
  	connection.query('UPDATE k_segments SET segment_name = "'+json.name+'" WHERE segment_status = 1 AND segment_id = '+json.id, function (error, results, fields) {
	  if (error) throw error;
	  if(error)
	  {	  	
	  	return res.json({edit_segment:false});
	  }
	  else
	  {
	  	return res.json({edit_segment:true});	
	  }
	});	
});

//http://localhost:4000/segment/del/3
app.get('/segment/del/:id', function(req, res){	
	var segment_id = req.param('id');		
  	connection.query('UPDATE k_segments SET segment_status = 0 WHERE segment_status = 1 AND segment_id = '+segment_id, function (error, results, fields) {
	  if (error) throw error;
	  if(error)
	  {	  	
	  	return res.json({del_segment:false});
	  }
	  else
	  {
	  	return res.json({del_segment:true});	
	  }
	});	
});

//http://localhost:4000/nodes
app.get('/nodes', function(req, res){		
  	connection.query('SELECT n.node_id AS id, n.node_nodeKey AS nodekey, n.node_sku AS sku, n.node_manufacturer AS manufacturer, n.node_version AS version, n.node_segment AS segment_id, s.segment_name AS segment_name ,n.node_registered_by AS user_id, u.user_name AS username, n.node_date AS date, n.node_status AS status FROM  (k_nodes n LEFT JOIN k_segments s ON n.node_segment = s.segment_id) LEFT JOIN k_users u ON u.user_id = n.node_registered_by WHERE n.node_status = 1', function (error, results, fields) {
	  if (error) throw error;
	  if(results.length != 0)
	  {	  	
	  	return res.json(results);
	  }
	  else
	  {
	  	return res.json({nodes:false});	
	  }
	});	
});

//http://localhost:4000/nodes/add/{"sku":"part2","manufacturer":"Kibitech","version":"0.1.0","user":"1","segment":"1"}
app.get('/nodes/add/:data', function(req, res){	
	var data = req.param('data');	
	var json = JSON.parse(data);
	var date = new Date();
  	var date_format = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();	    
  	connection.query('INSERT INTO k_nodes(node_nodeKey,node_sku,node_manufacturer,node_version,node_registered_by,node_segment,node_date,node_status) VALUES("'+generar(13)+'","'+json.sku+'","'+json.manufacturer+'","'+json.version+'",'+json.user+', '+json.segment+',"'+date_format+'",1)', function (error, results, fields) {
	  if (error) throw error;
	  if(error)
	  {	  	
	  	return res.json({node_add:false});
	  }
	  else
	  {
	  	return res.json({node_add:true});	
	  }
	});	
});

//http://localhost:4000/node/del/3
app.get('/node/del/:id', function(req, res){		
	var node_id = req.param('id');
  	connection.query('UPDATE k_nodes SET node_status = 0 WHERE node_id = '+node_id, function (error, results, fields) {
	  if (error) throw error;
	  if(error)
	  {	  	
	  	return res.json({node_del:false});
	  }
	  else
	  {
	  	return res.json({node_del:true});	
	  }
	});	
});

function generar(longitud)
{
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<longitud; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

http.listen(4000, function(){
  console.log('Kospr API running *:4000');
});