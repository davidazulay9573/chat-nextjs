"use client"
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Message } from "./lib/type";

let socket : any;

const Home = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  useEffect(() => {
    socketInitializer();

    return () => {
      socket?.disconnect();
    };
  }, []);

  async function socketInitializer() {
    await fetch("/api/chat");
    socket = io(); 
    socket.on("receive-message", (data: Message) => {
      setAllMessages((allMessages: Message[]) => [...allMessages, data]);
    });
  }

  function handleSubmit(e:any) {
    e.preventDefault();

    console.log("emitted");

    socket.emit("send-message", {
      username,
      message
    });
    setMessage("");
  }

  return (
    <div>
      <h1>Chat app</h1>
      <h1>Enter a username</h1>

      <input value={username} onChange={(e) => setUsername(e.target.value)} />

      <br />
      <br />

      <div>
        {allMessages.map((mesage, index) => (
          <div key={index}>
            {mesage.content}: {mesage.sender}
          </div>
        ))}

        <br />

        <form onSubmit={handleSubmit}>
          <input
            name="message"
            placeholder="enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete={"off"}
          />
        </form>
      </div>
    </div>
  );
};

export default Home;