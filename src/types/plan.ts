export type Plan = {
  name: string;
  quantity: number;
  price: {
    amount: number; // amount in cents
    currency: string;
  };
  isMostChosen: boolean;
};
