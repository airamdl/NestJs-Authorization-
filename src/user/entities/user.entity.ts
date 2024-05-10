import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 80 })
  email: string;

  @Column({default: false})
  isAdmin: boolean;
  
  @Column({ type: 'varchar', length: 255 })
  password: string;

}