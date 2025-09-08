import {
  BeforeInsert,
  Collection,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";
import { HashUtils } from "../../utils/HashUtils";

@Entity()
export class Users {
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
  
  @BeforeInsert()
  hashPassword(){
    const pswd = this.password;
    const HashedPassword = new HashUtils().hashSHA256(pswd);
    this.password = HashedPassword
  }
}
