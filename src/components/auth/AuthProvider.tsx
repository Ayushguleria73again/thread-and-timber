"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  type User,
  type Address
} from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: User["preferences"]) => void;
  updateAddresses: (addresses: Address[]) => void;
  refreshWalletBalance: () => Promise<void>;
  socialLogin: (data: { email: string; name?: string; provider: string }) => Promise<boolean>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("thread-timber-token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser({ ...userData, id: userData._id || userData.id });
        } else {
            localStorage.removeItem("thread-timber-token");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) return false;

      const data = await res.json();
      const normalizedUser = { ...data, id: data._id || data.id };
      localStorage.setItem("thread-timber-token", data.token);
      setUser(normalizedUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) return false;

      const data = await res.json();
      const normalizedUser = { ...data, id: data._id || data.id };
      localStorage.setItem("thread-timber-token", data.token);
      setUser(normalizedUser);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("thread-timber-token");
    setUser(null);
  };

  const updatePreferences = async (preferences: User["preferences"]) => {
    const token = localStorage.getItem("thread-timber-token");
    if (!token || !user) return;

    try {
      const res = await fetch(`${API_URL}/auth/preferences`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ preferences })
      });

      if (res.ok) {
        const updatedPrefs = await res.json();
        setUser({ ...user, preferences: updatedPrefs });
      }
    } catch (error) {
      console.error("Update preferences error:", error);
    }
  };

  const updateAddresses = async (addresses: Address[]) => {
    const token = localStorage.getItem("thread-timber-token");
    if (!token || !user) return;

    try {
      const res = await fetch(`${API_URL}/auth/addresses`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ addresses })
      });

      if (res.ok) {
        const updatedAddresses = await res.json();
        setUser({ ...user, addresses: updatedAddresses });
      }
    } catch (error) {
      console.error("Update addresses error:", error);
    }
  };

  const refreshWalletBalance = async () => {
    const token = localStorage.getItem("thread-timber-token");
    if (!token || !user) return;

    try {
      const res = await fetch(`${API_URL}/gift-cards/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const { walletBalance } = await res.json();
        setUser({ ...user, walletBalance });
      }
    } catch (error) {
      console.error("Refresh wallet balance error:", error);
    }
  };

  const socialLogin = async (socialData: { email: string; name?: string; provider: string }) => {
    try {
      const res = await fetch(`${API_URL}/auth/social-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socialData)
      });

      if (!res.ok) return false;

      const data = await res.json();
      const normalizedUser = { ...data, id: data._id || data.id };
      localStorage.setItem("thread-timber-token", data.token);
      setUser(normalizedUser);
      return true;
    } catch (error) {
      console.error("Social Login error:", error);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      updatePreferences,
      updateAddresses,
      refreshWalletBalance,
      socialLogin,
      isAdmin: !!user?.isAdmin
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

