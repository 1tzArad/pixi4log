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
import { Users } from "./Users";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    content!: string;

    @ManyToOne(() => Users, (user) => user.posts)
    author!: Users;

    @ManyToMany(() => Tags, (tags) => tags.posts)
    @JoinTable()
    tags!: Tags[];

    @Column({ type: 'bigint' })
    timestamp!: number;
}
