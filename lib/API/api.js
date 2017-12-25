var app 				= require('express')();
var express 			= require('express');
var bodyParser 			= require('body-parser');
var http 				= require('http').Server(app);
var jwt 				= require('jsonwebtoken');
var jwt_secret			= "Kospr_sec";
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

app.use(bodyParser.json());
app.use(cors())

app.get('/api/protected', ensureToken, function(req, res) {
  jwt.verify(req.token, jwt_secret, function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        description: 'Protected information. Congrats!'
      });
    }
  });
});

 
//Start web server

//http://localhost:4000
app.get('/', ensureToken, function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
	      res.sendFile(__dirname + '/index.html');
	    }
	});
});

app.post('/api/token/:data', function(req, res) {  	 	 
 	var data = req.param('data');
 	var json = JSON.parse(data);
 	console.log(data)
	connection.query('SELECT user_id AS id, user_name AS username, user_pass AS password FROM k_users WHERE user_name = "'+json.username+'"', function (error, results, fields) {
	  if (error) throw error;	  
		if(results.length != 0)
		{			
			if (json.username === results[0].username && md5(json.password) === results[0].password ) {
				const id = { user: results[0].id };
				const token = jwt.sign({ user: id.user }, jwt_secret);
				  res.json({
				    message: 'Authenticated! Use this token in the "Authorization" header',
				    token: token
				  });				
			} else {
				res.json({			    
				    token: false
				});
			}
		}
		else
		{
			res.json({			    
			    token: false
			});
		}
	});	
  	//
});

//http://localhost:4000/login/{"username":"admin","password":"admin"}
app.get('/login/:data', function(req, res){
	//jwt.verify(req.token, jwt_secret, function(err, data) {
	    //if (err) {
	      //res.sendStatus(403);
	    //} else {
	      	var data = req.param('data');
	      	var json = JSON.parse(data);
		  	connection.query('SELECT user_id AS id, user_name AS username, user_pass AS password, user_email AS email, user_status AS status, user_type AS type, user_date AS date FROM k_users WHERE user_name = "'+json.username+'"', function (error, results, fields) {
			  if (error) throw error;	  
			  if(results.length != 0)
			  {			  	
			  	if(results[0].username == json.username && results[0].password == md5(json.password))
			  	{
			  		const id = { user: results[0].id };
						const token = jwt.sign({ user: id.user }, jwt_secret);
			  		return res.json({login:true,user:{id:results[0].id,username:results[0].username,email:results[0].email,type:results[0].type,date:results[0].date,status:results[0].status,token:token}});
			  	}			  				  	
			  	else
			  	{
			  		return res.json({login:false});	
			  	}
			  }
			  else
			  {
			  	return res.json({login:false});	
			  }
			});	
	    //}
	//});	
});

//http://localhost:4000/users
app.get('/users', ensureToken, function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
      	connection.query('SELECT u.user_id AS id, u.user_name AS username, u.user_type AS type_id, t.type_name AS type, u.user_date AS date, u.user_status AS status FROM k_users u LEFT JOIN k_user_type t ON t.type_id = u.user_type WHERE u.user_status = 1', function (error, results, fields) {
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
	    }
	});	  	
});

//http://localhost:4000/users/type
app.get('/users/type', ensureToken, function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
	      	connection.query('SELECT t.type_id AS id , t.type_name AS name FROM k_user_type t WHERE t.type_status = 1', function (error, results, fields) {
			  if (error) throw error;
			  if(results.length != 0)
			  {	  	
			  	return res.json(results);
			  }
			  else
			  {
			  	return res.json({user_type:false});	
			  }
			});	
	    }
	});	  	
});

//http://localhost:4000/user/1
app.get('/user/:id', ensureToken, function(req, res){
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
	      	var id = req.param('id');
		  	connection.query('SELECT user_id AS id, user_name AS username, user_type AS type, user_date AS date, user_status AS status FROM k_users WHERE user_id = '+id, function (error, results, fields) {
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
	    }
	});	
});

//http://localhost:4000/user/add/{"username":"judlup","password":"kibitech","email":"judlup@domoteco.com","type":"1"}
app.get('/user/add/:data', ensureToken, function(req, res){
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
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
			  		var last_user = results_.insertId;
			  		return res.json({add_user:true, last_user: last_user});
			  	});
			  }
			});		
	    }
	});	
});

//http://localhost:4000/segments
app.get('/segments', ensureToken ,function(req, res){		
  	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
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
	    }
	});  	
});

//http://localhost:4000/segment/add/{"name":"Center"}
app.get('/segment/add/:data', ensureToken , function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
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
	    }
	});		
});

//http://localhost:4000/segment/edit/{"id":"2","name":"Center-"}
app.get('/segment/edit/:data', ensureToken , function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
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
	    }
	});	
});

//http://localhost:4000/segment/del/3
app.get('/segment/del/:id', ensureToken , function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
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
	    }
	});	
});

//http://localhost:4000/nodes
app.get('/nodes', ensureToken , function(req, res){		
  	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
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
	    }
  	});  	
});

//http://localhost:4000/nodes/add/{"sku":"part2","manufacturer":"Kibitech","version":"0.1.0","user":"1","segment":"1"}
app.get('/nodes/add/:data', ensureToken , function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
	      	var data = req.param('data');	
			var json = JSON.parse(data);
			var date = new Date();
		  	var date_format = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();	    
		  	connection.query('INSERT INTO k_nodes(node_nodeKey,node_sku,node_manufacturer,node_version,node_registered_by,node_segment,node_date,node_status) VALUES("'+generator(13)+'","'+json.sku+'","'+json.manufacturer+'","'+json.version+'",'+json.user+', '+json.segment+',"'+date_format+'",1)', function (error, results, fields) {
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
	    }
	});	
});

//http://localhost:4000/node/del/3
app.get('/node/del/:id', ensureToken , function(req, res){	
	jwt.verify(req.token, jwt_secret, function(err, data) {
	    if (err) {
	      res.sendStatus(403);
	    } else {
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
	    }
	});		
});


//KeyNode generator
function generator(longitud)
{
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var key = "";
  for (i=0; i<longitud; i++) key += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return key;
}

//Validator of authentication JWT
function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

http.listen(4000, function(){
  console.log('Kospr API running *:4000');
});