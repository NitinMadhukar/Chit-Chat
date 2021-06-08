const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./user');

const router = require('./router');
//creating the app 
const app = express();
// creating the http server 
const server = http.createServer(app);
// creating the socketio server 
const io = socketio(server);
//  use is way to register middlewares 
app.use(cors());
app.use(router);

//Start listening for socket events from Sails with the specified eventName.
// Triggers the provided callback function when a matching event is received.
//starts the connection
io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);
    
    // You can call the join method on the socket to subscribe the socket to a given room. 
    socket.join(user.room);

    //Inside the function we are using io.emit() to send a message to all the connected clients.
    //this code will notify when a user connects to the server.
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
   
    // If you want to broadcast to everyone except the person who connected you can use socket.broadcast.emit().

    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    //the socket.to() creates a property on the socket named roomdata that is an list of room names
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  // calling the sendmessage and sends the message to all except the one who sends it
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });
  
  //removing the user from the list using removeUser function
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      //displays the text that user x has left to everyone so we using emit function
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      // we can find if the user is exist in the user list
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));