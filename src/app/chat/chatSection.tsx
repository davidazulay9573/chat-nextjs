'use client'
import { useState, useEffect } from "react";
import { Message, User } from "@/lib/type";
import { io , Socket} from "socket.io-client";
import Link from "next/link";
 
let socket : Socket;

export default function ChatSection({users, sender, receiving} : {users : User[], sender : User, receiving: User}){
  
  const [messageContent, setMessageContent] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>([]);
   const [onlineUsers, setOnlineUsers] = useState<{[key: string]: boolean}>({});
  const [isTyping, setIsTyping] = useState(false);

  useEffect( () => {
   (async () => {
    await  socketInit();
    const messages = receiving ?  await (await fetch(`http://localhost:3000/api/chat?sender=${sender._id}&receiving=${receiving._id}`)).json() : [];
    messages && !messages.error && setAllMessages(messages) 
    })();

    return () => {
      socket?.disconnect();
      socket?.off("users-status");
        
    };
  }, [receiving]);
    
 function handleTyping(e: any) {
  setMessageContent(e.target.value);
   socket.emit('typing', { isTyping : e.target.value.length > 0 });
 }

 async function socketInit() {
    socket = io({query : {userId: sender._id}}); 
    socket.on("receive-message", (data: Message) => { 
      console.log(data);
      
      setAllMessages((allMessages: Message[]) => [...allMessages, data]);
    });
    socket.on("user_typing", (data : any) => {
      setIsTyping(data.isTyping);
    });
    socket.on('users-status', (users : {}) => {
      setOnlineUsers(users);
    });
  }

  function handleSendMessage(e:any) {
    e.preventDefault();
    socket.emit("send-message", { sender : sender._id, receiving : receiving._id, content :messageContent });
    setMessageContent("");
  }
  
  return (
    <div className="dark:bg-gray-800 min-h-screen">
        <div className="flex flex-col lg:flex-row">

          {/* User List - Shown on all screen sizes, but on large screens, it's on the side */}
          <div className="lg:w-1/3 lg:border-r lg:border-gray-700">
            <div className="space-y-4 p-4 overflow-y-auto">
              {users.map((user: User) => (
                <Link href={`/chat/?user=${user._id}`} key={user._id} className="flex items-center space-x-4">
                  <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                  <p className="text-white">{user.name}</p>
                  {onlineUsers[user._id] && <span className="text-green-500">Online</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Chat Section - Only shown if 'receiving' is defined */}
          {receiving && (
            <div className="lg:w-2/3 flex flex-col">
              <div className="border-b border-gray-700 p-4 flex items-center space-x-3">
                <img src={receiving.image} alt={receiving.name} className="w-10 h-10 rounded-full" />
                <div className="font-semibold text-white">{receiving.name}</div>
                {onlineUsers[receiving._id] && <span className="text-green-500">Online</span>}
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
              {allMessages.map((message : Message, index) => {
                  return message.sender === sender._id 
                    ? <div key={index} className="flex items-end justify-end space-x-2 mb-4">
                        <p className="bg-blue-500 text-white rounded px-4 py-2" style={{ whiteSpace: "pre-wrap" }}>
                            {message.content}
                        </p>
                        <img src={sender.image} className="w-10 h-10 bg-gray-300 rounded-full" />
                      </div> 
                    : <div key={index} className="flex items-end space-x-2 mb-4">
                        <img src={receiving.image} className="w-10 h-10 bg-gray-700 rounded-full" />
                        <p className="bg-gray-200 rounded px-4 py-2" style={{ whiteSpace: "pre-wrap" }}>
                          {message.content}
                        </p>
                    </div>
                })}
              </div>

              {isTyping && <p className="m-2 text-white">Typing...</p>}

              <form onSubmit={handleSendMessage} className="flex flex-col space-y-4 p-4">
                <textarea
                  value={messageContent}
                  onChange={handleTyping}
                  autoComplete={"off"}
                  name="message"
                  className="p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Type your message here..."
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Send Message
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    )
}