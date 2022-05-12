export type Plan = {
  id: string;
  name: string;
  quantity: number;
  price: {
    amount: number; // amount in cents
    currency: string;
  };
  isMostChosen: boolean;
};
