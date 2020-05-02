import { Model, Column, Table, BelongsToMany, DataType } from 'sequelize-typescript';
import { User } from './User';
import { LovedProduct } from './LovedProduct';

@Table
export class Product extends Model<Product> {
  @Column
  name!: string;

  @BelongsToMany(() => User, () => LovedProduct)
  lovedUsers: User[];

  @Column(DataType.VIRTUAL(DataType.BOOLEAN))
  get loved(this: Product): boolean {
    return this.getDataValue('lovedUsers') && this.getDataValue('lovedUsers').length ? true : false;
  }
}
