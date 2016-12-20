"use stict";

let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server, {serveClient: true});

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
  socket.emit('connected', "Now you are connected to server. Enjoy =)");
  socket.on('client:event', function (data) {
    console.log(data);
  });
});

server.listen('0.0.0.0', 8080, () => {
  console.log("Server started on 0.0.0.0:8080");
});

module.export = server;
