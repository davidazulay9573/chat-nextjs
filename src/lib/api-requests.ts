
const API_AND_POINT ='http://localhost:3000/api'

export async function getUser(id:string){
  try {
    const response = await fetch(`${API_AND_POINT}/users/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function getUsers(){
  try {
    const response = await fetch(`${API_AND_POINT}/users`);
    const data = await response.json();
    return data;

  } catch (error) {
    return error;
  }
}

export async function getMessages(senderId: string, receivingId:string){
 try {
   const messages =  await (await fetch(`${API_AND_POINT}/chat?sender=${senderId}&receiving=${receivingId}`)).json() 
   if(messages && !messages.error) return messages;
   return []
 } catch (error) {
    return error;
 }
}



