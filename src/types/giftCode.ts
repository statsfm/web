export type GiftCode = {
  id: number;
  stripePaymentId: string;
  purchaseDate: string;
  claimedDate: string | null;
  claimedBy: string | null;
  boughtBy: string;
  productId: string;
  code: string;
  message: string;
};
