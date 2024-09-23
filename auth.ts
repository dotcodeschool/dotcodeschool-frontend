import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

import clientPromise from "@/lib/db/mongodb";

const adapter = MongoDBAdapter(clientPromise);

export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  adapter,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
