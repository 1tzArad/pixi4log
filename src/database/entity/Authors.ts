import {
  Collection,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";

@Entity()
export class Authors {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @OneToMany(() => Posts, (post) => post.author)
  posts!: Posts[];

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "bigint" })
  timestamp!: number;
}
