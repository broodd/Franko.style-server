import { Model, Column, Table, ForeignKey } from 'sequelize-typescript';
import { Product } from './Product';
import { Category } from './Category';

@Table
export class ProductCategory extends Model<ProductCategory> {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => Category)
  @Column
  categoryId: number;
}
