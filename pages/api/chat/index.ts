import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server, Socket } from "socket.io";
import { Message } from "../../../server/models/message";
import { revalidatePath } from "next/cache";

type NextApiResponseWithIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: Server;
    };
  };
};

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponseWithIO) {
  const {sender, receiving} = req.query;
  if(!sender ){
  
     res.json(await Message.find() || []);

  }
  try {
     if (res.socket.server.io) {
    console.log("Socket is already running");
    const messages = await Message.find({
     $or: [
     { $and: [{ sender: sender }, { receiving: receiving }] },
     { $and: [{ sender: receiving }, { receiving: sender }] }
     ]
    }) ;
     res.json(messages|| []);
    return;
  }
  console.log("Setting up Socket.io");
  const io = new Server(res.socket.server);

  io.on("connection",(socket: Socket) => {
    socket.on("send-message",  async (data:any) => {  
      const message = new Message(data)
      await message.save()
      io.emit("receive-message", data);
    });
  });

  res.socket.server.io = io;
  const messages = await Message.find({
     $or: [
     { $and: [{ sender: sender }, { receiving: receiving }] },
     { $and: [{ sender: receiving }, { receiving: sender }] }
     ]
    }) ;
  res.json(messages || []);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  } 
}
