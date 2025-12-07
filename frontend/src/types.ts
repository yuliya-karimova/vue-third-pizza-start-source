export interface Sauce {
  id: number;
  name: string;
  price: number;
}

export interface Ingredient {
  id: number;
  name: string;
  image: string;
  price: number;
}

export interface Size {
  id: number;
  name: string;
  image: string;
  multiplier: number;
}

export interface Dough {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

export interface Misc {
  id: number;
  name: string;
  image: string;
  price: number;
}

export type IngredientsCounter = Record<
  number,
  { count: number; price: number }
>;
