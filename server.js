"use stict";

let app = require('express')();
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let mongoose = require('mongoose');
let UsersModel = require('./UsersModel');
let server = require('http').Server(app);
let io = require('socket.io')(server, {serveClient: true});

// Connect to test DB
mongoose.connect('mongodb://fingerprint:recognizer@ds052629.mlab.com:52629/fingerprint-recognizer');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
    let users = await UsersModel.find().lean();
    res.status(200).send({"result": users});
});

app.post('/add', (req, res) => {
    res.status(200).send(req.body);
});

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
  socket.emit('connected', "Now you are connected to server. Enjoy =)");
  socket.on('client:event', function (data) {
    console.log(data);
  });
});

server.listen(8080, '0.0.0.0', async () => {
  console.log("Server started on 0.0.0.0:8080");
});

module.export = server;
