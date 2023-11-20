import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],

  callbacks: {
    // signIn: async ({ user }) => {
    //   const { id, email, ...restUser } = user;
    //   const docRef = db.collection("users").doc(id);
    //   const doc = await docRef.get();

    //   // if (!doc.exists) {
    //   //   await db
    //   //     .collection("users")
    //   //     .doc(id)
    //   //     .set({
    //   //       ...restUser,
    //   //       bio: "",
    //   //       friendRequests: [],
    //   //       friends: [],
    //   //       followers: [],
    //   //       following: [],
    //   //       createdAt: Date.now(),
    //   //     });
    //   }
    //   return true;
    // },
      
    session: async ({ session, token }: {session : any , token : any}) => {
      session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };