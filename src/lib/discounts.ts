export type DiscountCode = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  expiresAt?: string;
};

const DISCOUNT_CODES: DiscountCode[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minPurchase: 50
  },
  {
    code: "FIRST20",
    type: "percentage",
    value: 20,
    minPurchase: 100
  },
  {
    code: "SAVE15",
    type: "fixed",
    value: 15,
    minPurchase: 75
  }
];

export const validateDiscountCode = (
  code: string,
  subtotal: number
): DiscountCode | null => {
  const discount = DISCOUNT_CODES.find(
    (d) => d.code.toUpperCase() === code.toUpperCase()
  );
  if (!discount) return null;
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return null;
  }
  if (discount.minPurchase && subtotal < discount.minPurchase) {
    return null;
  }
  return discount;
};

export const calculateDiscount = (
  discount: DiscountCode,
  subtotal: number
): number => {
  if (discount.type === "percentage") {
    return (subtotal * discount.value) / 100;
  }
  return discount.value;
};
