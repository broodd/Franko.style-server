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
    type: DataType.STRING,
    get() {
      return '';
      // return JSON.parse(JSON.parse(this.getDataValue('sizes')));
    },
    set(value) {
      console.log('--- value', value, typeof value);
      this.setDataValue('sizes', JSON.stringify(value));
    },
  })
  sizes: string;

  @Column({
    type: DataType.STRING,
    get() {
      console.log('--- ', this.getDataValue('images'), typeof this.getDataValue('images'));
      return '';
      // return JSON.parse(JSON.parse(this.getDataValue('images')));
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(JSON.stringify(value)));
    },
  })
  images: string;

  @Column(DataType.VIRTUAL(DataType.STRING))
  get image(this: Product): string {
    const imagesDB = this.getDataValue('images');
    if (imagesDB) {
      const images = JSON.parse(JSON.parse(imagesDB));
      return images && images[0] ? 'http://localhost:3000/static/images/' + images[0] : '';
    }
    return '';
  }

  @BelongsToMany(() => User, () => LovedProduct)
  lovedUsers: User[];

  @BelongsToMany(() => User, () => CartProduct)
  cartUsers: User[];

  @BelongsToMany(() => Category, () => ProductCategory)
  categories: Category[];

  @Column(DataType.VIRTUAL(DataType.BOOLEAN))
  get loved(this: Product): boolean {
    return this.getDataValue('lovedUsers') && this.getDataValue('lovedUsers').length ? true : false;
  }

  @Column(DataType.VIRTUAL(DataType.BOOLEAN))
  get cart(this: Product): boolean {
    return this.getDataValue('cartUsers') && this.getDataValue('cartUsers').length ? true : false;
  }
}
