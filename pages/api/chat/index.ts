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
    const userConnections = new Map();
    io.on("connection", (socket: Socket) => {
      io.to(receiving).emit("user_connected");
      
      socket.on("disconnect", () => {
        userConnections.delete(sender);
         io.to(receiving).emit("user_disconnected");
      });

      socket.on("send-message", async (data) => {
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
