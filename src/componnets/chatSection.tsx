'use client'
import { useState, useEffect } from "react";
import { Message, User } from "@/lib/type";
import { io } from "socket.io-client";
 
let socket : any ;

export default function ChatSection({sender, receiving} : {sender : User, receiving: User}){
  const [messageContent, setMessageContent] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect( () => {
   (async () => {
    await  socketInit();
    const messages = await (await fetch(`/api/chat?sender=${sender._id}&receiving=${receiving._id}`)).json();
    messages && !messages.error && setAllMessages(messages) 
    })();

    return () => {
      socket?.disconnect();
      socket.off("user_connected");
      socket.off("user_disconnected");      
    };
  }, []);
    
 function handleTyping(e: any) {
  setMessageContent(e.target.value);
   socket.emit('typing', { isTyping : e.target.value.length > 0 });
}

  async function socketInit() {
    socket = io({query : {userId: sender._id}}); 
    socket.on("receive-message", (data: Message) => { 
      setAllMessages((allMessages: Message[]) => [...allMessages, data]);
    });
    socket.on("user_typing", (data : any) => {
     setIsTyping(data.isTyping);
    });
     
    socket.on("user_connected", (data : any) => { console.log(data);    
      setIsUserOnline(data.isConnected);   
    });
    socket.on("user_disconnected", (data : any) => {
      console.log(data);
      setIsUserOnline(data.isConnected);
    });
  }
  function handleSubmit(e:any) {
    e.preventDefault();
    socket.emit("send-message", { sender : sender._id, receiving : receiving._id, content :messageContent });
    setMessageContent("");
  }
  
  return (
      <div>
        <div className="border-b p-4 flex items-center space-x-3">
        <div className="relative w-8 h-8 ">
          <img src={receiving?.image} alt={`${receiving?.name}`} className="w-10 h-10 bg-gray-300 rounded-full" />
           {isUserOnline && <span className=" mt-3 text-green">Online</span>}
           <p>{isUserOnline}</p>
        </div>
        <div className="font-semibold">{receiving?.name}</div>
      </div>
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
            
      <div className="m-2">
        {isTyping && <p>Typing...</p>}
      </div>

       <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
          <textarea
            value={messageContent}
            onChange={handleTyping}
            onKeyDown={handleTyping}
            autoComplete={"off"}
            name="message"
            className="p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:outline-none"
            placeholder="Type your message here..." />
           
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Send Message
          </button>
       </form>
     </div>
    )
}