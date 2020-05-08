import { Model, Column, Table } from 'sequelize-typescript';

@Table
export class Sprint extends Model<Sprint> {
  @Column
  title: string;

  @Column
  subtitle: string;

  @Column
  image: string;

  @Column
  link: string;

  @Column
  order: number;
}
