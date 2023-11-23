import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server, Socket } from "socket.io";
import { Message } from "../../../server/models/message";

type NextApiResponseWithIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: Server;
    };
  };
};

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponseWithIO) {
  const { sender , receiving }  =  req.query;
  if (sender && receiving) {
  if (!res.socket.server.io) { 
    const io = new Server(res.socket.server);
    let connectedUsers : {[key: string]: boolean} = {};
    io.on("connection", (socket: Socket) => {     
      const userId = socket.handshake.query.userId;
      if (typeof userId === 'string') {
          connectedUsers[userId] = true;

          socket.on('disconnect', () => {
            delete connectedUsers[userId];
            io.emit('users-status', connectedUsers);
          });

          io.emit('users-status', connectedUsers);
      }
      io.emit('users-status', connectedUsers);

      socket.on("send-message", async (data) => {
        console.log(data);
        
        const message = new Message(data);
        await message.save();
        io.emit("receive-message", data);
      });

      socket.on("typing", (data) => {   
        socket.broadcast.emit("user_typing", { isTyping: data.isTyping }); 
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Using existing Socket.io server.");
  }

    try {
      const messages = await Message.find({
        $or: [
          { $and: [{ sender: sender }, { receiving: receiving }] },
          { $and: [{ sender: receiving }, { receiving: sender }] },
        ],
      });

      res.json(messages || []);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "Sender and receiving query parameters are required." });
  }
}
