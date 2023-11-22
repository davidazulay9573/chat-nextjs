import NextAuth , { AuthOptions, User as UserType } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import  { User }  from "../../../server/models/user";
import connectMongo from "../../../server/utils/connectMongo";

export const authOptions : AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {  signIn: "/" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],

  callbacks: {  
    signIn : async ({ user }:{ user : UserType} ) => {     
      await connectMongo();     
      const { name, email, image} = user;
      console.log(image);
      
      if (!await User.findOne({email : email})) {
        const newUser =  await new User({ name, email, image}); 
        await newUser.save() 
        if(newUser)return true;
        return false;
      }
      return true ;
    }
  },
};

export default NextAuth(authOptions);