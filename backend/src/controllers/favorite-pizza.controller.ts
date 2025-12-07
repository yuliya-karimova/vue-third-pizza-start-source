import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  oas,
  OperationVisibility,
} from '@loopback/rest';
import {FavoritePizza} from '../models';
import {FavoritePizzaRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';

@authenticate('jwt')
export class FavoritePizzaController {
  constructor(
    @repository(FavoritePizzaRepository)
    public favoritePizzaRepository: FavoritePizzaRepository,
    @inject(SecurityBindings.USER, {optional: true})
    private user: UserProfile,
  ) {}

  @post('/favorite-pizzas')
  @response(200, {
    description: 'FavoritePizza model instance',
    content: {'application/json': {schema: getModelSchemaRef(FavoritePizza)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FavoritePizza, {
            title: 'NewFavoritePizza',
            exclude: ['id', 'userId', 'createdAt'],
          }),
          example: {
            name: "Моя любимая пицца",
            sauceId: 1,
            doughId: 1,
            sizeId: 1,
            ingredients: [
              { ingredientId: 1, quantity: 2 },
              { ingredientId: 2, quantity: 1 }
            ],
          },
        },
      },
    })
    favoritePizza: Omit<FavoritePizza, 'id' | 'userId' | 'createdAt'>,
  ): Promise<FavoritePizza> {
    const userId = this.user[securityId];
    return this.favoritePizzaRepository.create({
      ...favoritePizza,
      userId,
    });
  }

  @oas.visibility(OperationVisibility.UNDOCUMENTED)
  @get('/favorite-pizzas/count')
  @response(200, {
    description: 'FavoritePizza model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FavoritePizza) where?: Where<FavoritePizza>,
  ): Promise<Count> {
    const userId = this.user[securityId];
    const userWhere = {...where, userId};
    return this.favoritePizzaRepository.count(userWhere);
  }

  @get('/favorite-pizzas')
  @response(200, {
    description: 'Array of FavoritePizza model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FavoritePizza, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FavoritePizza) filter?: Filter<FavoritePizza>,
  ): Promise<FavoritePizza[]> {
    const userId = this.user[securityId];
    // Фильтруем только пиццы текущего пользователя
    const userFilter: Filter<FavoritePizza> = {
      ...filter,
      where: {...filter?.where, userId},
      include: ['sauce', 'dough', 'size'],
    };
    return this.favoritePizzaRepository.find(userFilter);
  }

  @get('/favorite-pizzas/{id}')
  @response(200, {
    description: 'FavoritePizza model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FavoritePizza, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FavoritePizza, {exclude: 'where'}) filter?: FilterExcludingWhere<FavoritePizza>,
  ): Promise<FavoritePizza> {
    const userId = this.user[securityId];
    const favoritePizza = await this.favoritePizzaRepository.findById(id, {
      ...filter,
      include: ['sauce', 'dough', 'size'],
    });
    
    // Проверяем, что пицца принадлежит текущему пользователю
    if (favoritePizza.userId !== userId) {
      throw new HttpErrors.Forbidden('Доступ запрещен');
    }
    
    return favoritePizza;
  }

  @patch('/favorite-pizzas/{id}')
  @response(204, {
    description: 'FavoritePizza PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FavoritePizza, {partial: true, exclude: ['id', 'userId', 'createdAt']}),
        },
      },
    })
    favoritePizza: Partial<FavoritePizza>,
  ): Promise<void> {
    const userId = this.user[securityId];
    
    // Проверяем, что пицца принадлежит текущему пользователю
    const existing = await this.favoritePizzaRepository.findById(id);
    if (existing.userId !== userId) {
      throw new HttpErrors.Forbidden('Доступ запрещен');
    }
    
    await this.favoritePizzaRepository.updateById(id, favoritePizza);
  }

  @put('/favorite-pizzas/{id}')
  @response(204, {
    description: 'FavoritePizza PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() favoritePizza: FavoritePizza,
  ): Promise<void> {
    const userId = this.user[securityId];
    
    // Проверяем, что пицца принадлежит текущему пользователю
    const existing = await this.favoritePizzaRepository.findById(id);
    if (existing.userId !== userId) {
      throw new HttpErrors.Forbidden('Доступ запрещен');
    }
    
    await this.favoritePizzaRepository.replaceById(id, {
      ...favoritePizza,
      userId, // Сохраняем userId
    });
  }

  @del('/favorite-pizzas/{id}')
  @response(204, {
    description: 'FavoritePizza DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const userId = this.user[securityId];
    
    // Проверяем, что пицца принадлежит текущему пользователю
    const existing = await this.favoritePizzaRepository.findById(id);
    if (existing.userId !== userId) {
      throw new HttpErrors.Forbidden('Доступ запрещен');
    }
    
    await this.favoritePizzaRepository.deleteById(id);
  }
}

