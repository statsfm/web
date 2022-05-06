export type GiftCode = {
  id: number;
  stripePaymentId: string;
  purchaseDate: string;
  claimedDate: string | null;
  claimedById: string | null;
  boughtById: string;
  claimedBy: any | null;
  boughtBy: any;
  productId: string;
  code: string;
  message: string;
};
