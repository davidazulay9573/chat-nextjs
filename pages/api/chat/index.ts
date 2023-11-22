import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server, Socket } from "socket.io";
import { cookies } from 'next/headers';

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

  io.on("connection", (socket: Socket) => {
    socket.on("send-message", (data: any) => {
      io.emit("receive-message", data);
    });
  });

  res.socket.server.io = io;

  res.end();
}
