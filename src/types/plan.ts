import { CurrencyCode } from "./index";

export type Plan = {
  id: string;
  name: string;
  quantity: number;
  price: Price;
  isMostChosen: boolean;
};

export type Price = {
  amount: number;
  currency: CurrencyCode;
};
