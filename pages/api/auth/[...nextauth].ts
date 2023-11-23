import NextAuth , { NextAuthOptions,  User as UserType } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import  { User }  from "../../../server/models/user";
import connectMongo from "../../../server/utils/connectMongo";

export const authOptions : NextAuthOptions = {
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
        
      if (!await User.findOne({email : email})) {
        const newUser =  await new User({ name, email, image }); 
        await newUser.save()   

        
        if(newUser)return true;
        return false;
      }
      return true ;
    },  
      session: async ({ session , token } : {session : any, token : any}) => {
        if(session){
          const {_id} = await User.findOne({email : session.user.email})
          session.user._id = `${_id.toString()}`;      
        } 
       return session;
    },  
  },
};

export default NextAuth(authOptions);