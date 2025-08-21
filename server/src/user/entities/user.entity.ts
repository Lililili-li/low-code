import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer'

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string

  @Column({select: false})
  password: string
}

