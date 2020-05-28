import {
  Model,
  Column,
  Table,
  ForeignKey,
  Default,
  Min,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from './Product';
import { User } from './User';

/* IMPORTANT !!!
	in db need remove auto created index for fields(productId, userId)
	or create migration and use it, but typescript not use it
	so I just do query when sync sequelize
*/

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
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => User)
  @Column
  userId: number;

  // @Index({
  //   name: 'CartProducts_userId_productId_unique2',
  //   type: 'UNIQUE',
  //   unique: true,
  // })
  @Default('universal')
  @Column
  selectedSize: string;

  @Default(1)
  @Min(1)
  @Column
  count: number;
}
