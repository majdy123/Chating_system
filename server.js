const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const format = require('./utils/messages')
const {userJoin , userleave,getRoomUsers, getcurr} = require('./utils/user')


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botname = "bot";


//set the express static folder (public)
app.use(express.static(path.join(__dirname,'public')));

//run while client connect 
io.on('connection',socket => {
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id , username,room);

        socket.join(user.room);

        socket.emit('message',format(botname , 'Welcome to chat time'));
        //brodcasting when user connect
        console.log(user);
        socket.broadcast.to(user.room)
        .emit('message', format(`${user.username}`,
        `${user.username} Just Joined !`));//give user notifaction

        
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    });
    
    //listen for chat messages
    socket.on('chatMessage',(msg)=>{
        const user = getcurr(socket.id);
        io.to(user.room).emit('message',format(user.username,msg))
    })
    //when user disconnect
    socket.on('disconnect',()=>{
        const user = userleave(socket.id);
        if(user){
            io.to(user.room).emit('message',format(botname ,`${user.username} 
            Just Left..`));


            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            });


        }});
        
});


const PORT = 3000 || process.env.PORT
server.listen(PORT, () => {console.log(`server port is ${PORT}`)});