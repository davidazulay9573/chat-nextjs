'use client'
import { useState, useEffect, useRef } from "react";
import { Message, User } from "@/lib/type";
import { getMessages } from "@/lib/api-requests";
import { io , Socket} from "socket.io-client";
import Link from "next/link";
import { dateFormat } from "@/lib/utils";
 
let socket : Socket;

export default function ChatSection({users, sender, receiving} : {users : User[], sender : User, receiving: User}){
  
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{[key: string]: boolean}>({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}, [messages]);
  useEffect( () => {
    socketInit();
    return () => {
      socket?.disconnect();
    };
  }, [receiving]);

 const socketInit = async() => {
    socket = io({query : {userId: sender._id}}); 
    socket.on("receive-message", (data: Message) => { 
      setMessages((messages: Message[]) => [...messages, data]);
    });
    socket.on("user_typing", (data : any) => {
      setIsTyping(data.isTyping);
    });
    socket.on('users-status', (users : {}) => {
      setOnlineUsers(users);
    });
    if(receiving){
      const messages =  await getMessages(sender._id, receiving._id) || []
      messages &&  setMessages(messages) 
    }  
  }  

 const handleTyping = (e: any) => {
  setMessageContent(e.target.value);
   socket.emit('typing', { isTyping : e.target.value.length > 0 });
 }

 const handleSendMessage = (e:any) => {
    e.preventDefault();
    socket.emit("send-message", { sender : sender._id, receiving : receiving._id, content :messageContent , createdAt: Date.now()});
    setMessageContent("");
  }
  
  return (
    <div className="dark:bg-gray-800 min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {(!receiving || innerWidth > 1000) && 
        <div className="lg:flex lg:w-1/2 lg:border-r text-white lg:border-gray-700 overflow-y-auto">
          <div className="space-y-4 p-4">
            {users.map((user) => (
              <Link href={`/chat/?user=${user._id}`} key={user._id} className="flex justify-between border-b p-4 w-80 items-center">
                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                <p>{user.name}</p>
                {onlineUsers[user._id] ? <span className="text-green-500">Online</span> : <span className="text-gray-500">Offline</span> }
              </Link>
            ))}
          </div>
        </div>}
        {receiving && (
          <div className="flex flex-1 flex-col lg:w-1/2">
            <div className="flex-none border-b border-gray-700 p-4 flex items-center space-x-3">
              <img src={receiving.image} alt={receiving.name} className="w-10 h-10 rounded-full" />
              <div className="font-semibold text-white">{receiving.name}</div>
              {onlineUsers[receiving._id] && <span className="text-green-500">Online</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message : Message, index) => {
                  return message.sender === sender._id 
                     ? <div key={index} className="flex flex-col items-end space-x-2 mb-2">
                        <div className="bg-gray-700 text-white rounded pb-2 pt-2  px-4 py-2" style={{ whiteSpace: "pre-wrap" }}>
                          <span>{message.content}</span><br />
                          <span className="text-gray-400 text-xs mt-1">{dateFormat(message.createdAt)}</span>
                        </div>
                      </div> 
                    : <div key={index} className="flex flex-col items-start space-x-2 mb-2">
                        <div className="bg-gray-500 text-white  rounded pb-2 pt-2 px-4 py-2" style={{ whiteSpace: "pre-wrap" }}>
                           <span>{message.content}</span><br />
                           <span className="text-gray-400 text-xs mt-1">{dateFormat(message.createdAt)}</span>
                        </div>
                      </div>
                  })}
                <div ref={messagesEndRef} /> 
             </div>

            <div className=" bottom-0 mb-4 w-full flex flex-col items-center">
            {isTyping && <div className="m-2 ">Typing...</div>}

              <form onSubmit={handleSendMessage} className="space-y-4 p-4">
               <textarea
                  value={messageContent}
                  onChange={handleTyping}
                  autoComplete="off"
                  name="message"
                  className="p-2 w-full border rounded-md border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Type your message here..."
                />
                <button type="submit" className="p-2 w-full bg-blue-200 text-black rounded-full hover:bg-blue-500">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>

   )
}