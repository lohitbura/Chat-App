
 var express = require('express');
 var path = require('path');
 var http = require('http');
 var socketIo = require('socket.io');
 var authRouter = require('./router/authRoutes');
 var app = express();
var bodyParser = require('body-parser');
 var publicPath = path.join(__dirname,'public');


const {generateMessage,generateLocationMessage} = require('./utils/message');
app.use(express.static(publicPath));
app.set('view engine','ejs');

app.use('/',authRouter);

app.use(bodyParser.urlencoded({extended: false}));
var server = http.createServer(app);

var io = socketIo(server);

 io.on('connection',(socket)=>
 {
 	console.log("user connected to server");

  socket.broadcast.emit('newMessage',generateMessage('Admin','New User Connected'));


 	socket.on('createMessage',(message, callback) =>
 	{
 		console.log("message is ",message);

    io.emit('newMessage',generateMessage(message.from,message.text,message.createdAT));
    callback();
 	});
  socket.on('createLocationMessage',(coords)=>
{
  io.emit('newLocationMessage',generateLocationMessage(coords.from,coords.latitude,coords.longitude,coords.createdAT));
});

 	socket.on('disconnect',()=>
 {
 	console.log("user disconnected from the server");
  socket.broadcast.emit('newMessage',generateMessage('Admin','User left The lobby'));
 });
 });

server.listen(4000,()=>
 {
 	console.log("listening to port 4000");
 });
