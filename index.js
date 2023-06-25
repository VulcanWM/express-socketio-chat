const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.ejs');
});

const users = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('login', function(username){
        users[socket.id] = username;
        io.emit("user joined", username)
    });

    socket.on('disconnect', function(){
        io.emit("user left", users[socket.id])
        delete users[socket.id];
    });
    socket.on('chat message', (user, msg) => {
        io.emit('chat message', user, msg);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});