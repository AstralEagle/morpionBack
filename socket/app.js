const {Server} = require("socket.io")
module.exports = (server) => {


    const io = new Server(server,{cors:{
        origin: '*',
        method: ["GET","POST"],
    }})
    io.on('connect', (socket) => {
        console.log('User Connected : '+ socket.id)
        
        socket.on('joinGame',(value,callBack) => {

            socket.join(value.room)
            callBack(null)
        });
    })

     
    return io;
}
