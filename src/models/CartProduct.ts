import { Model, Column, Table, ForeignKey } from 'sequelize-typescript';
import { Product } from './Product';
import { User } from './User';

@Table
export class CartProduct extends Model<CartProduct> {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
