import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Roles {
  
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string

  @Column()
  userId: string
}

