const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let users = {}; // { socket.id: username }

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new user', (username) => {
    users[socket.id] = username;
    io.emit('user list', Object.values(users)); // send updated list
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user list', Object.values(users)); // update list when user leaves
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

