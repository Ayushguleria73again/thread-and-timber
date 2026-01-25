import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "./auth";

const USER_COOKIE = "thread-timber-user";

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE);
  if (!userCookie?.value) return null;
  try {
    return JSON.parse(userCookie.value) as User;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login?redirect=/payment");
  }
  return user;
}
