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

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithIO) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
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
  
  res.end();
}
