
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



