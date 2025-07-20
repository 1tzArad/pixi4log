import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    BeforeInsert,
    ManyToMany,
    JoinTable
} from "typeorm";
import { Tags } from "./Tags";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    content!: string;

    @ManyToMany(() => Tags, (tags) => tags.posts)
    @JoinTable()
    tags!: Tags[];

    @Column({ type: 'bigint' })
    timestamp!: number;
}
