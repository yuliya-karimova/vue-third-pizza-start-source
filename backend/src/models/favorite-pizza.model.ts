import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User, CustomUserWithRelations} from './user.model';
import {Sauce, SauceWithRelations} from './sauce.model';
import {Dough, DoughWithRelations} from './dough.model';
import {Size, SizeWithRelations} from './size.model';

export interface IFavoriteIngredient {
  ingredientId: number;
  quantity: number;
}

@model()
export class FavoritePizza extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Sauce)
  sauceId: number;

  @belongsTo(() => Dough)
  doughId: number;

  @belongsTo(() => Size)
  sizeId: number;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  ingredients: IFavoriteIngredient[];

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  constructor(data?: Partial<FavoritePizza>) {
    super(data);
  }
}

export interface FavoritePizzaRelations {
  user?: CustomUserWithRelations;
  sauce?: SauceWithRelations;
  dough?: DoughWithRelations;
  size?: SizeWithRelations;
}

export type FavoritePizzaWithRelations = FavoritePizza & FavoritePizzaRelations;

