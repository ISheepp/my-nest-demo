import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

/**
 * 定义咖啡类
 */
@Entity() // 默认使用类名的小写作为数据库的table name，也可以在注解内指定
export class Coffee {
  /**
   * 默认不可以为空
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  /**
   * 定义此字段为json类型
   * 可以为空
   */
  // @Column('json', { nullable: true })
  // cascade 级联插入 可以指定 insert 或 update
  @JoinTable()
  @ManyToMany(() => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
  })
  flavors: Flavor[];
}
