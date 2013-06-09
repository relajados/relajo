var port = process.env.PORT || 5000;

var express = require("express");
var app = express();
var io = require('socket.io').listen(app.listen(port));

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

console.log("Listening on port " + port);

app.use(express.static(__dirname + '/public'));

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  console.log('connection: ' + socket);
  io.sockets.emit('message', 'connection ' + socket.id);

  socket.on('message', function(message, callback) {
    console.log('message: ' + message);
    io.sockets.emit('message', message);
  });

  socket.on('eval', function(json) {
    console.log('eval: ' + json);
    io.sockets.emit('eval', json);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});
