import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {
  FavoritePizza,
  FavoritePizzaRelations,
  User,
  Sauce,
  Dough,
  Size,
} from '../models';
import {UserRepository} from './user.repository';
import {SauceRepository} from './sauce.repository';
import {DoughRepository} from './dough.repository';
import {SizeRepository} from './size.repository';

export class FavoritePizzaRepository extends DefaultCrudRepository<
  FavoritePizza,
  typeof FavoritePizza.prototype.id,
  FavoritePizzaRelations
> {
  public readonly user: BelongsToAccessor<User, typeof FavoritePizza.prototype.id>;
  public readonly sauce: BelongsToAccessor<Sauce, typeof FavoritePizza.prototype.id>;
  public readonly dough: BelongsToAccessor<Dough, typeof FavoritePizza.prototype.id>;
  public readonly size: BelongsToAccessor<Size, typeof FavoritePizza.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('SauceRepository')
    protected sauceRepositoryGetter: Getter<SauceRepository>,
    @repository.getter('DoughRepository')
    protected doughRepositoryGetter: Getter<DoughRepository>,
    @repository.getter('SizeRepository')
    protected sizeRepositoryGetter: Getter<SizeRepository>,
  ) {
    super(FavoritePizza, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.sauce = this.createBelongsToAccessorFor('sauce', sauceRepositoryGetter);
    this.registerInclusionResolver('sauce', this.sauce.inclusionResolver);
    this.dough = this.createBelongsToAccessorFor('dough', doughRepositoryGetter);
    this.registerInclusionResolver('dough', this.dough.inclusionResolver);
    this.size = this.createBelongsToAccessorFor('size', sizeRepositoryGetter);
    this.registerInclusionResolver('size', this.size.inclusionResolver);
  }
}

