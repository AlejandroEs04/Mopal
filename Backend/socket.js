import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const server = createServer();

const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL, 
        origin: process.env.FRONTEND_URL_2, 
    }
})

io.on('connection', socket => {
    console.log("New client connected:", socket.id);

    socket.on('newProduct', product => {
        console.log(product)

        io.emit('productCreated', product)
    })
});

export default server