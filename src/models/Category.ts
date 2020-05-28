import { Model, Column, Table, ForeignKey, HasMany, BelongsToMany } from 'sequelize-typescript';
import { ProductCategory } from './ProductCategory';
import { Product } from './Product';

@Table
export class Category extends Model<Category> {
  @Column
  name!: string;

  @Column
  image: string;

  @ForeignKey(() => Category)
  parentId: number;

  @HasMany(() => Category)
  children: Category[];

  @BelongsToMany(() => Product, () => ProductCategory)
  products: Product[];
}
