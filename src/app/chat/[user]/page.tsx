
import { io } from "socket.io-client";
import { getUser } from "@/lib/api-requests";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { User } from "@/lib/type";
import ChatSection from "../chatSection";

export default async function Page({ params }: { params: { user: string } }){
 
 const session : {user: User} | null = await getServerSession(authOptions);
 const userSession = await getUser(session?.user?._id as string);
 const userChat = await getUser(params.user);
 console.log(session?.user._id);
 console.log(params.user);
 
 
 const messages = await (await fetch("http://localhost:3000/api/chat")).json()

 let socket : any ;
    socket = io(); 
    // socket.on("receive-message", (data: any) => {      
    //   revalidatePath(`/chat/${params.user}`);
    // });

  return (
   <div>    
      <ChatSection sender={userSession} receiving={userChat} />
   </div>
  );
};

