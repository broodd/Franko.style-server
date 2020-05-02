import {
  Model,
  Column,
  Table,
  Index,
  DataType,
  Default,
  IsEmail,
  Length,
  IsDate,
  BeforeSave,
  DefaultScope,
  BelongsToMany,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt-nodejs';
import { createJWToken } from '../util/auth';
import { LovedProduct } from './LovedProduct';
import { Product } from './Product';

@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
@Table
export class User extends Model<User> {
  @Column
  phone: string;

  @IsEmail
  @Column
  @Index({
    name: 'index_email',
    type: 'UNIQUE',
    unique: true,
  })
  email!: string;

  @Length({ min: 6, max: 100 })
  @Column
  password!: string;

  @Column
  resetToken: string;

  @IsDate
  @Column
  resetTokenSentAt: Date;

  @IsDate
  @Column
  resetTokenExpireAt: Date;

  @Default('CLIENT')
  @Column(DataType.ENUM('CLIENT', 'MODERATOR', 'ADMIN'))
  role: 'CLIENT' | 'MODERATOR' | 'ADMIN';

  @Default('PENDING')
  @Column(DataType.ENUM('ACTIVE', 'DELETED', 'PENDING'))
  status: 'ACTIVE' | 'DELETED' | 'PENDING';

  @BelongsToMany(() => Product, () => LovedProduct)
  lovedProducts: Product[];

  // HOOKS
  @BeforeSave
  static beforeSaveHook(instance: User, options: any): void {
    if (instance.changed('password')) {
      instance.password = bcrypt.hashSync(instance.password, bcrypt.genSaltSync(10));
    }
  }

  public generateToken(): string {
    return createJWToken({ email: this.email, id: this.id });
  }

  public authenticate(value: string): Boolean {
    return !!bcrypt.compareSync(value, this.password);
  }
}
