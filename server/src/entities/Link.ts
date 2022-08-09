import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Link extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  link!: string;

  @Field()
  @Column({ unique: true })
  hash!: string;

  @ManyToOne(() => User, (user) => user.links)
  creator!: User;

  @Field()
  @Column()
  creatorId!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
