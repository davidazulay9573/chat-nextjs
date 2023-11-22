import { revalidatePath } from "next/cache";
import { io } from "socket.io-client";
export default function Page({ params }: { params: { user: string } }){
const userChat = params.user
 let socket;
 async function socketInitializer() {
    await fetch("/api/chat");
    socket = io(); 
    socket.on("receive-message", (data: any) => {
      revalidatePath(`/chat/${userChat}`)
    });
  }

  return (
   <div>    
    <div>{userChat}</div>
    <div className="border-b p-4 flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
      <div className="font-semibold">Alice Smith</div>
    </div>
    <div className="flex-1 p-4 overflow-y-auto"> 
      <div className="flex items-end space-x-2 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full"/>
        <div className="bg-gray-200 rounded px-4 py-2">
          Hi there! How are you doing?
        </div>
      </div>
      <div className="flex items-end justify-end space-x-2 mb-4">
        <div className="bg-blue-500 text-white rounded px-4 py-2">
          I'm doing great, thanks for asking!
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
      </div> 
    </div>
   </div>
  );
};

