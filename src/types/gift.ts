export type Plan = {
  id: string;
  name: string;
  quantity: number;
  price: {
    amount: number;
    currency: string;
  };
  isMostChosen: boolean;
};

export type GiftCode = {
  id: number;
  stripePaymentId: string;
  purchasedAt: string;
  claimedAt: string | null;
  claimedById: string | null;
  boughtById: string;
  claimedBy: any | null;
  boughtBy: any;
  productId: string;
  code: string;
  message: string;
};
