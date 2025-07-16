import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Posts} from "./Posts";

@Entity()
export class Categories {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    name!: string

    @Column()
    fancyName!: string

    @Column()
    icon!: string

    @OneToMany(() => Posts, (post) => post.category)
    posts!: Posts[];
}