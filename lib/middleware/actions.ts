"use server";

import { signIn, signOut } from "@/auth";

export async function handleSignIn(options?: { redirectTo?: string }) {
  await signIn("", options);
}

export async function handleSignOut() {
  await signOut();
}
