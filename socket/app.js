const {Server} = require("socket.io")
const {addUser} = require('../database/users')

module.exports = (server) => {


    const io = new Server(server,{cors:{
        origin: '*',
        method: ["GET","POST"],
    }})
    io.on('connect', (socket) => {
        console.log('User Connected : '+ socket.id)
        
        socket.on('joinGame',(value,callBack) => {
            const {user, error} = addUser({id : socket.id, name : value.userID, room : value.room});

            if(error) {
                return callBack(error);
            }

            socket.join(value.room)
            callBack(null)
        });
    })

     
    return io;
}
