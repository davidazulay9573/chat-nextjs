"use client";

import { SessionProvider as Provider } from "next-auth/react";

export default function SessionProvider({children, session }:{children : any, session : any}) {
  return <Provider>{children}</Provider>;
}