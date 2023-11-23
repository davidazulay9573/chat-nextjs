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
  // Initialize socket.io only once
  if (!res.socket.server.io) {
    console.log("Initializing new Socket.io server...");
    const io = new Server(res.socket.server);

    io.on("connection", (socket: Socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("send-message", async (data) => {
        const message = new Message(data);
        await message.save();
        io.emit("receive-message", data);
      });

      socket.on("typing", (data) => {
        console.log('Typing data received:', data); 
        socket.broadcast.emit("user_typing", { isTyping: data.isTyping }); 
      });

      // Add additional event listeners here if needed
    });

    res.socket.server.io = io;
  } else {
    console.log("Using existing Socket.io server.");
  }

  // Extract sender and receiving from the query parameters
  const { sender, receiving } = req.query;

  // Handle fetching messages only if sender and receiving are defined
  if (sender && receiving) {
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
    // If sender and receiving aren't provided, we don't need to fetch messages
    res.status(400).json({ error: "Sender and receiving query parameters are required." });
  }
}
