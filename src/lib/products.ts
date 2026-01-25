export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inventory: number;
  rating?: number;
  reviews?: number;
  tag?: string;
  images?: string[];
  materials?: string; // e.g. "Organic Cotton"
  palette?: string[]; // e.g. ["#000", "#fff"]
  sizes?: string[]; // e.g. ["S", "M", "L"]
  isFeatured?: boolean;
};

// Placeholder for type safety until all components are updated to fetch dynamically
export const allProducts: Product[] = [];
