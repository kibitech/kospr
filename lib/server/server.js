var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Authentication service
require('socketio-auth')(io, {
  authenticate: function (socket, data, callback) {

    var nodekey = data.nodekey;
    //Pending to add mysql management
    if(nodekey == "Kibitech_2017" || nodekey == "Kibitech_web_2017")
    {
      return callback(null, data.nodekey == nodekey);  
    }
    else
    {
      return callback(new Error("Nodekey not found"));
    }        
  }
});

//Current version library
var version = "0.1.0";

//Start web server
app.get('/', function(req, res){
  res.sendFile(__dirname + '/kospr-mgr/index.html');
});

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/kospr-mgr/bower_components'));
app.use('/assets',  express.static(__dirname + '/kospr-mgr/assets'));
app.use('/controllers',  express.static(__dirname + '/kospr-mgr/controllers'));
app.use('/views',  express.static(__dirname + '/kospr-mgr/views'));


//Socket.io server
io.on('connection', function(socket){
    
  console.log('a user connected');

  socket.on('msg', function(msg){
    console.log('message: ' + msg);
    io.sockets.emit('msg',msg);
  });

  socket.on('version', function(msg){
    //console.log('Version: ' + version);
    socket.emit('version',version);    
  });

  socket.on('associate', function(msg){
    //console.log('VALUES: ');
    //console.log(msg);
    socket.emit('associate',true);    
  });

  socket.on('status', function(msg){        
    socket.emit('status',socket.connected);    
  });

  socket.on('test', function(msg){            
    socket.emit('test',"Test | "+msg);    
  });

  socket.on('broadcast', function(msg){
    console.log('broadcast: ' + msg);
    io.sockets.emit('broadcast',msg);
  });

  socket.on('control', function(msg){
    console.log('Control Payload: ' + msg);
    socket.emit('control',true);
    //Pending to code
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('Kospr running *:3000');
});
