"use stict";

let app = require('express')();
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let mongoose = require('mongoose');
let UsersModel = require('./UsersModel');
let HistoryModel = require('./HistoryModel');
let server = require('http').Server(app);
let io = require('socket.io')(server, {serveClient: true});

// Connect to test DB
// mongoose.connect('mongodb://fingerprint:recognizer@ds052629.mlab.com:52629/fingerprint-recognizer');
mongoose.connect('mongodb://localhost:27017/fingers');
mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
    let users = await UsersModel.find({}).select('_id username image.buffer').lean().exec();
    res.status(200).send({"result": users});
});

app.delete('/users/:id', async (req, res) => {
    let result = await UsersModel.findByIdAndRemove(req.params.id).exec();
    console.log(result);
    res.status(200).send({"result": result});
});

app.get('/history', async (req, res) => {
    let history = await HistoryModel.find({}).select('image.buffer match').populate('match.username', 'username').lean().exec();
    res.status(200).send({"result": history});
});

app.post('/add', (req, res) => {
    res.status(200).send(req.body);
});

app.use('/', express.static(path.join(__dirname, 'public')));

// Serve index page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
