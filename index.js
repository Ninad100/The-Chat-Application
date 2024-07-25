import express from "express"
import http from "http"
import { Server } from "socket.io";
import { userModel } from "./user.schema.js";
import cors from 'cors'
import { messageModel } from "./message.schema.js";

export const app = express();
app.use(cors());
export const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: '*',
        method: ['POST','GET']
    }
});

io.on('connect',(socket)=>{
    console.log('socket is connected');

    //Notification of typing
    socket.on('typing_notify',(data)=>{
        socket.broadcast.emit('typing_notify',data);
    })

    socket.on('typing_release',(username)=>{
        socket.broadcast.emit('typing_release');
    })

    //Section of chatting.


    //Following entire section is about displaying number of connected users.
    socket.on('join', async (data)=>{
        const newUser = new userModel({
            userName: data
        });
        await newUser.save();
        socket.userid = newUser._id;
        const previousMsgs = await messageModel.find()
        const allUsers = await userModel.find();
        console.log(allUsers.length)
        socket.emit('join',allUsers,allUsers.length,newUser.userName);
        socket.emit('load_previous',previousMsgs)
        socket.broadcast.emit('total_users',allUsers,allUsers.length,newUser.userName)
    });


    //sending message
    socket.on('send_message', async (username,message)=>{
        const newMessage = new messageModel({
            from: username,
            text: message,
            time: new Date()
        });

        await newMessage.save();

        socket.broadcast.emit('receive_message',newMessage);
    });
    

    /*socket.on('user_disconnect', async ()=>{
        /*const disconnectUser = await userModel.findByIdAndDelete({_id: socket.userid});
        socket.broadcast.emit('total_users',allUsers,allUsers.length,'');
        console.log(socket.userid);
        try{
            const disconnectUser = await userModel.findByIdAndDelete({_id: socket.userid});
        }catch(err){
            console.log(err);
        }
        

        
    })*/

    //On the disconnect of page, the user will be removed from the conencted users list
    socket.on('disconnect',async()=>{
        if(socket.userid){
            const disconnectUser = await userModel.findByIdAndDelete({_id: socket.userid});
            const allUsers = await userModel.find();
            socket.broadcast.emit('total_users',allUsers,allUsers.length,'')
        }
        
        console.log('Socket is disconnected');
    })
    /*socket.on('disconnect', async ()=>{
        console.log('Socket is disconnected');
        /*const allUsers = await userModel.find();
        const disconnectUser = await userModel.findByIdAndDelete({_id: userid});
        if(disconnectUser){
            socket.broadcast.emit('total_users',allUsers,allUsers.length,'')
        }
        //const disconnectUser = await userModel.findByIdAndDelete({_id: socket.userid});

    })*/
})