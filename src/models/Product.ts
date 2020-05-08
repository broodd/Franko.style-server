import { Model, Column, Table, BelongsToMany, DataType } from 'sequelize-typescript';
import { User } from './User';
import { LovedProduct } from './LovedProduct';
import { CartProduct } from './CartProduct';

@Table
export class Product extends Model<Product> {
  @Column
  name!: string;

  @Column
  price!: number;

  @BelongsToMany(() => User, () => LovedProduct)
  lovedUsers: User[];

  @BelongsToMany(() => User, () => CartProduct)
  cartUsers: User[];

  @Column(DataType.VIRTUAL(DataType.BOOLEAN))
  get loved(this: Product): boolean {
    return this.getDataValue('lovedUsers') && this.getDataValue('lovedUsers').length ? true : false;
  }

  @Column(DataType.VIRTUAL(DataType.BOOLEAN))
  get cart(this: Product): boolean {
    return this.getDataValue('cartUsers') && this.getDataValue('cartUsers').length ? true : false;
  }
}
