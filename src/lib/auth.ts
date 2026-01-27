
export type Address = {
  id: string;
  label: string; // e.g., "Home", "Office"
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
};

export type User = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  addresses?: Address[];
  preferences?: {
    notifications: {
      collections: boolean;
      journal: boolean;
      restock: boolean;
    };
    accessibility: {
      reducedMotion: boolean;
      largeText: boolean;
    };
    privacy: {
      publicWishlist: boolean;
    };
    sustainability: {
      showImpact: boolean;
    };
    localization: {
      currency: string;
      language: string;
    };
  };
  wishlist?: string[];
  isAdmin?: boolean;
  walletBalance?: number;
  savedCards?: SavedCard[];
  upiId?: string;
};

const CURRENT_USER_KEY = "thread-timber-current-user";

const isBrowser = () => typeof window !== "undefined";

export const getCurrentUser = (): User | null => {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: User | null) => {
  if (!isBrowser()) return;
  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};
