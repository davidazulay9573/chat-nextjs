
import { getUser, getUsers } from "@/lib/api-requests";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { User } from "@/lib/type";
import ChatSection from "./chatSection";

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string | undefined }}){

 const session : {user: User} | null = await getServerSession(authOptions);
 const userSession = await getUser(session?.user?._id as string);
 const userChat = searchParams?.user && await getUser(searchParams?.user as string);
 const users = await getUsers();
 
  return (
   <div className="bg-gray">    
     <ChatSection 
       users={users.filter((user: User) => user._id !== session?.user?._id)}
       sender={userSession} 
       receiving={userChat} 
     />
   </div>
  );
};

