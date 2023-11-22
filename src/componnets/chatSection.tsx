'use client'
import { useState, useEffect } from "react";
import { Message, User } from "@/app/lib/type";
import { io } from "socket.io-client";
 let socket : any ;

export default function ChatSection({sender, receiving} : {sender : User, receiving: User}){
  const [messageContent, setMessageContent] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  console.log(sender, receiving);
  
  
  useEffect( () => {
    socketInit();
   (async () => {const messages = await (await fetch(`/api/chat?sender=${sender._id}&receiving=${receiving._id}`)).json();setAllMessages(messages || []) })() ;
   
    return () => {
      socket?.disconnect();
    };
  }, []);

  async function socketInit() {

    socket = io(); 
    socket.on("receive-message", (data: Message) => {
      setAllMessages((allMessages: Message[]) => [...allMessages, data]);
    });
  }
  function handleSubmit(e:any) {
    e.preventDefault();
    console.log("emitted");
    socket.emit("send-message", { sender : sender._id, receiving : receiving._id, content :messageContent });
    setMessageContent("");
  }

    return (
        <div>
          <div className="flex-1 p-4 overflow-y-auto"> 
             {allMessages.map((message : Message, index) => {
                return message.sender === sender._id 
                       ? <div key={index} className="flex items-end justify-end space-x-2 mb-4">
                            <p className="bg-blue-500 text-white rounded px-4 py-2">
                                {message.content}
                            </p>
                            <img src={sender.image} className="w-10 h-10 bg-gray-300 rounded-full" />
                         </div> 
                       : <div key={index} className="flex items-end space-x-2 mb-4">
                            <img src={sender.image} className="w-10 h-10 bg-gray-300 rounded-full" />
                            <p className="bg-gray-200 rounded px-4 py-2">
                              {message.content}
                            </p>
                         </div>
              })}
          </div>
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 p-4">
            <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                autoComplete={"off"}
                name="message"
                className="p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Type your message here..."
            ></textarea>
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Send Message
           </button>
       </form>
     </div>
    )
}