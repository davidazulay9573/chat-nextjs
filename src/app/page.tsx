import { getUsers } from "@/lib/api-requests";
import { User } from "@/lib/type";

const Home = async () => {
  
const users = await getUsers();
  return (
    <div>
      {users.map((user : User) => {
        return <p>{user.name}</p>
      })}
    </div>
  );
};

export default Home;
