import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  photo: string
  
  @Column()
  gender: number

  @Column()
  address: string

  @Column({select: false})
  userId: number
}
