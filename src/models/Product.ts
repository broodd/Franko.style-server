import { Model, Column, Table, BelongsToMany, DataType } from 'sequelize-typescript';
import { User } from './User';
import { LovedProduct } from './LovedProduct';
import { CartProduct } from './CartProduct';
import { Category } from './Category';
import { ProductCategory } from './ProductCategory';

@Table
export class Product extends Model<Product> {
  @Column
  name!: string;

  @Column
  price!: number;

  @Column({
    type: DataType.JSON,
    get() {
      return this.getDataValue('sizes');
    },
    set(value: string) {
      this.setDataValue(
        'sizes',
        JSON.parse(
          value.replace(/(\w+:)|(\w+ :)/g, function (matchedStr: string) {
            return '"' + matchedStr.substring(0, matchedStr.length - 1).toUpperCase() + '":';
          })
        )
      );
    },
  })
  sizes: string;

  @Column({
    type: DataType.JSON,
  })
  images: string[] | string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column(DataType.VIRTUAL(DataType.STRING))
  get image(): string {
    const images = this.getDataValue('images');
    return images && images[0] ? images[0] : '';
  }

  @BelongsToMany(() => User, () => LovedProduct)
  lovedUsers: User[];

  // @BelongsToMany(() => Size, () => CartProduct)
  // cartSizes: Size[];

  @BelongsToMany(() => User, () => CartProduct)
  cartUsers: User[];

  @BelongsToMany(() => Category, () => ProductCategory)
  categories: Category[];

  @Column(DataType.VIRTUAL(DataType.BOOLEAN))
  get loved(): boolean {
    return this.getDataValue('lovedUsers') && this.getDataValue('lovedUsers').length ? true : false;
  }
}
