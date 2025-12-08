import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, CustomUserRelations, UserCredentials, Address, Order, FavoritePizza} from '../models';
import {DatabaseDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserCredentialsRepository} from './user-credentials.repository';
import {AddressRepository} from './address.repository';
import {OrderRepository} from './order.repository';
import {FavoritePizzaRepository} from './favorite-pizza.repository';

export class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, CustomUserRelations> {
  public readonly customUserCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;

  public readonly addresses: HasManyRepositoryFactory<Address, typeof User.prototype.id>;

  public readonly orders: HasManyRepositoryFactory<Order, typeof User.prototype.id>;

  public readonly favoritePizzas: HasManyRepositoryFactory<FavoritePizza, typeof User.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>, @repository.getter('AddressRepository') protected addressRepositoryGetter: Getter<AddressRepository>, @repository.getter('OrderRepository') protected orderRepositoryGetter: Getter<OrderRepository>, @repository.getter('FavoritePizzaRepository') protected favoritePizzaRepositoryGetter: Getter<FavoritePizzaRepository>,
  ) {
    super(User, dataSource);
    this.orders = this.createHasManyRepositoryFactoryFor('orders', orderRepositoryGetter,);
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
    this.addresses = this.createHasManyRepositoryFactoryFor('addresses', addressRepositoryGetter,);
    this.registerInclusionResolver('addresses', this.addresses.inclusionResolver);
    this.favoritePizzas = this.createHasManyRepositoryFactoryFor('favoritePizzas', favoritePizzaRepositoryGetter,);
    this.registerInclusionResolver('favoritePizzas', this.favoritePizzas.inclusionResolver);
    this.customUserCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver('userCredentials', this.customUserCredentials.inclusionResolver);
  }

  async findCredentials(userId: typeof User.prototype.id): Promise<UserCredentials | undefined> {
    try {
      return await this.customUserCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
