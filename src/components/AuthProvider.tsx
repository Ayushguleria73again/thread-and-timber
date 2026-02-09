"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  getCurrentUser,
  getStoredUsers,
  saveUsers,
  seedUsersIfNeeded,
  setCurrentUser,
  type User
} from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedUsersIfNeeded();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      document.cookie = `thread-timber-user=${JSON.stringify(currentUser)}; path=/; max-age=86400`;
    }
  }, []);

  const login = (email: string, password: string) => {
    const users = getStoredUsers();
    const match = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );
    if (!match || match.password !== password) {
      return false;
    }
    setCurrentUser(match);
    setUser(match);
    document.cookie = `thread-timber-user=${JSON.stringify(match)}; path=/; max-age=86400`;
    return true;
  };

  const signup = (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    const exists = users.some(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    setCurrentUser(newUser);
    setUser(newUser);
    document.cookie = `thread-timber-user=${JSON.stringify(newUser)}; path=/; max-age=86400`;
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    document.cookie = "thread-timber-user=; path=/; max-age=0";
  };

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

