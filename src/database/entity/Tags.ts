import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Posts} from "./Posts";

@Entity()
export class Tags {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    name!: string

    @Column()
    fancyName!: string

    @Column()
    icon!: string

    @ManyToMany(() => Posts, (post) => post.tags)
    posts!: Posts[];
}