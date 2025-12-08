import { HttpService } from "./base/http.service";

export interface OrderPizzaIngredient {
  id?: number;
  pizzaId?: number;
  ingredientId: number;
  quantity: number;
}

export interface OrderPizza {
  id?: number;
  name: string;
  sauceId: number;
  doughId: number;
  sizeId: number;
  quantity: number;
  orderId?: number;
  ingredients: OrderPizzaIngredient[];
}

export interface OrderMisc {
  id?: number;
  orderId?: number;
  miscId: number;
  quantity: number;
}

export interface CreateOrderDto {
  phone?: string;
  pizzas: Array<{
    name: string;
    sizeId: number;
    doughId: number;
    sauceId: number;
    quantity: number;
    ingredients: Array<{
      ingredientId: number;
      quantity: number;
    }>;
  }>;
  misc: Array<{
    miscId: number;
    quantity: number;
  }>;
  address: {
    id?: number;
    name: string;
    street: string;
    building: string;
    flat?: string;
    comment?: string;
  };
}

export interface Order {
  id?: number;
  userId?: string;
  addressId?: number;
  phone?: string;
  orderPizzas?: OrderPizza[];
  orderMisc?: OrderMisc[];
  orderAddress?: {
    id?: number;
    name: string;
    street: string;
    building: string;
    flat?: string;
    comment?: string;
    userId?: string;
  };
}

export class OrdersService extends HttpService {
  constructor(baseURL?: string) {
    super(baseURL);
  }

  async findAll(): Promise<Order[]> {
    return this.get<Order[]>("/orders");
  }

  async findOne(id: number): Promise<Order> {
    return this.get<Order>(`/orders/${id}`);
  }

  async create(data: CreateOrderDto): Promise<Order> {
    return this.post<Order>("/orders", data);
  }

  async deleteById(id: number): Promise<void> {
    return this.delete<void>(`/orders/${id}`);
  }
}

