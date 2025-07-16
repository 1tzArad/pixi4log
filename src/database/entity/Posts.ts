import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    BeforeInsert
} from "typeorm";
import { Categories } from "./Categories";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    content!: string;

    @ManyToOne(() => Categories, (category) => category.posts)
    category!: Categories;

    @Column({ type: 'bigint' })
    timestamp!: number;
}
