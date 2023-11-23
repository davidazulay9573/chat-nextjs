import "./globals.css";
import NavBar from "./layouts/navBar";
import Footer from "./layouts/footer";
import SessionProvider from "./layouts/sessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";


export const metadata = {
  title: "Posts-Router",
  description: "",
};

export default async function RootLayout({ children }: {children : any}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <SessionProvider  session={session}>
        <body className="flex flex-col min-h-screen">
          <NavBar />
          <div className="flex-grow p-4">{children}</div>
          <Footer />
        </body>
      </SessionProvider>
    </html>
  );
}