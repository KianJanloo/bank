import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @BeforeInsert()
  setFullname() {
    this.fullname = `${this.firstName} ${this.lastName}`;
  }

  @Column({ nullable: false })
  fullname: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  nationalCode: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'simple-array',
    nullable: false,
    enum: ['admin', 'user'],
    default: 'user',
  })
  roles: string[];

  @Column({ nullable: false, default: '50000' })
  amount: string;
}
