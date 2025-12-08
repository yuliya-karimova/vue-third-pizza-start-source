import { HttpService } from "./base/http.service";

export interface FavoriteIngredient {
  ingredientId: number;
  quantity: number;
}

export interface FavoritePizza {
  id?: number;
  name: string;
  userId?: string;
  sauceId: number;
  doughId: number;
  sizeId: number;
  ingredients: FavoriteIngredient[];
  createdAt?: string;
  // Включенные связи
  sauce?: {
    id: number;
    name: string;
    price: number;
    key: string;
  };
  dough?: {
    id: number;
    name: string;
    price: number;
    key: string;
  };
  size?: {
    id: number;
    name: string;
    multiplier: number;
    key: string;
  };
}

export interface CreateFavoritePizzaDto {
  name: string;
  sauceId: number;
  doughId: number;
  sizeId: number;
  ingredients: FavoriteIngredient[];
}

export class FavoritePizzasService extends HttpService {
  constructor(baseURL?: string) {
    super(baseURL);
  }

  async findAll(): Promise<FavoritePizza[]> {
    return this.get<FavoritePizza[]>("/favorite-pizzas");
  }

  async findOne(id: number): Promise<FavoritePizza> {
    return this.get<FavoritePizza>(`/favorite-pizzas/${id}`);
  }

  async create(data: CreateFavoritePizzaDto): Promise<FavoritePizza> {
    return this.post<FavoritePizza>("/favorite-pizzas", data);
  }

  async update(id: number, data: Partial<CreateFavoritePizzaDto>): Promise<void> {
    return this.patch<void>(`/favorite-pizzas/${id}`, data);
  }

  async deleteById(id: number): Promise<void> {
    return this.delete<void>(`/favorite-pizzas/${id}`);
  }
}

