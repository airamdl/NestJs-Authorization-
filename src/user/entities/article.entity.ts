import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    isPublished: boolean;

    @Column()
    authorId: number;
}