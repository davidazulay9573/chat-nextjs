
import { revalidatePath } from "next/cache";
import { io } from "socket.io-client";
import { getUser, getUsers } from "@/lib/api-requests";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { Message, User } from "@/lib/type";
import ChatSection from "@/componnets/chatSection";

export default async function Page({ params }: { params: { user: string } }){

 const session : {user: User} | null = await getServerSession(authOptions);
 const userSession = await getUser(session?.user?._id as string);

 const userChat = await getUser(params.user);
 const messages = await (await fetch("http://localhost:3000/api/chat")).json()

 let socket : any ;
    socket = io(); 
    socket.on("receive-message", (data: any) => {      
      revalidatePath(`/chat/${params.user}`);
    });

  return (
   <div>    
    <div>{params.user}</div>
    <div className="border-b p-4 flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
      <div className="font-semibold">Alice Smith</div>
    </div>
      <ChatSection sender={userSession} receiving={userChat} />
   </div>
  );
};

