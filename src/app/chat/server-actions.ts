'use server'
import { revalidatePath } from "next/cache"
export async function sendMessage(sender : string, receiving : string){
  revalidatePath(`/chat/${sender}`);
  revalidatePath(`/chat/${receiving}`);

}