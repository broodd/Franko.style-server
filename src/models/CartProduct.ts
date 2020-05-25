import { Model, Column, Table, ForeignKey, Default, Min, Max } from 'sequelize-typescript';
import { Product } from './Product';
import { User } from './User';

@Table({
  indexes: [
    {
      name: 'cart_product_user_size',
      type: 'UNIQUE',
      unique: true,
      fields: ['productId', 'userId', 'selectedSize'],
    },
  ],
})
export class CartProduct extends Model<CartProduct> {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Default('universal')
  @Column
  selectedSize: string;

  @Default(1)
  @Min(1)
  @Column
  count: number;
}
