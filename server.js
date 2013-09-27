var port = process.env.PORT || 5000;

var express = require("express");
var app = express();
var io = require('socket.io').listen(app.listen(port));

io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1);

app.use(express.static(__dirname + '/public'));
/*
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
*/
io.sockets.on('connection', function (socket) {
  console.log('connection' + socket.id);
  io.sockets.emit('message', 'connection ' + socket.id);

  socket.on('message', function(message, callback) {
    console.log('message ' + message + ' callback ' + callback);
    io.sockets.emit('message', message);
  });

  socket.on('stop', function(json) {
    console.log('stop ' + json);
    io.sockets.emit('stop', json);
  });

  socket.on('eval', function(json) {
    console.log('eval ' + json);
    io.sockets.emit('eval', json);
  });

  socket.on('disconnect', function (socket) {
    console.log('disconnect' + socket.id);
    io.sockets.emit('message', 'disconnect ' + socket.id);
  });
});

console.log("Listening on port " + port);
