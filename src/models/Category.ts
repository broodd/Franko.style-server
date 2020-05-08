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

@Table
export class Category extends Model<Category> {
  @Column
  name!: string;

  @Column
  image: string;

  @Column(DataType.VIRTUAL(DataType.STRING))
  get imageSrc(this: Category): string {
    return `${this.image ? 'http://localhost:3000/static/images/' + this.image : ''}`.trim();
  }

  @ForeignKey(() => Category)
  parentId: number;

  @HasMany(() => Category)
  childrens: Category[];

  @BelongsToMany(() => Product, () => ProductCategory)
  products: Category[];
}
