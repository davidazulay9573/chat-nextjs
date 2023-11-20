"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";


function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const links = session
    ? [
        { title: "Home", path: "/" },
        { title: "Chat", path: "/chat" },
      ]
    : [
        { title: "Home", path: "/" },
      ];
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
             {/* logo */}
            </div>
            <div className="hidden sm:block sm:ml-6">
              <ul className="flex gap-4">
                {links.map((item) => (
                  <li
                    key={item.path}
                    className={
                      pathname == item.path
                        ? "bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium "
                        : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    }
                  >
                    <Link href={item.path}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {session ? (
            <>
              <button
                onClick={() => signOut()}
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Sign out
              </button>
              <Link href="/personal">
                {/* {session?.user?.name} */}
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                  src={session?.user?.image as string}
                  alt={session?.user?.name as string}
                />
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google")}
                className="flex text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium "
              >
                <img
                  loading="lazy"
                  className="m-1"
                  height="20"
                  width="20"
                  src="https://authjs.dev/img/providers/google.svg"
                />
                <span className="m-1">Sign in with Google</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`flex ${isOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="px-2 pt-2 pb-3">
          <ul className="flex flex-col gap-4">
            {links.map((item) => (
              <li
                onClick={() => setIsOpen(!isOpen)}
                key={item.path}
                className={
                  pathname == item.path
                    ? "bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium "
                    : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                }
              >
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;