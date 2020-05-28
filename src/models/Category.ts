import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { ProductCategory } from './ProductCategory';
import { Product } from './Product';
import { SERVER_URL } from '../util/secrets';

@Table
export class Category extends Model<Category> {
  @Column
  name!: string;

  @Column({
    type: DataType.STRING,
    get: function () {
      return `${
        this.getDataValue('image')
          ? SERVER_URL + '/static/images/' + this.getDataValue('image')
          : ''
      }`.trim();
    },
  })
  image: string;

  @ForeignKey(() => Category)
  parentId: number;

  @HasMany(() => Category)
  children: Category[];

  @BelongsToMany(() => Product, () => ProductCategory)
  products: Product[];
}
