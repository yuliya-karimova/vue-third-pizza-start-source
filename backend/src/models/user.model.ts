import {Entity, model, hasOne, property, hasMany} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {Address, AddressWithRelations} from './address.model';
import {Order, OrderWithRelations} from './order.model';
import {FavoritePizza, FavoritePizzaWithRelations} from './favorite-pizza.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  avatar?: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => Address)
  addresses: Address[];

  @hasMany(() => Order)
  orders: Order[];

  @hasMany(() => FavoritePizza)
  favoritePizzas: FavoritePizza[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface CustomUserRelations {
  // describe navigational properties here
  addresses?: AddressWithRelations[];
  orders?: OrderWithRelations[];
  favoritePizzas?: FavoritePizzaWithRelations[];
}

export type CustomUserWithRelations = User & CustomUserRelations;
