import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // The Primary ID ( unique )

  @Column({ nullable: false })
  firstName: string; // User's first name

  @Column({ nullable: false })
  lastName: string; // User's last name

  @Column({ nullable: false, unique: true })
  email: string; // Unique email for login

  @Column({ nullable: false })
  password: string; // Hashed password

  @Column({ nullable: false })
  phoneNumber: string; // Optional, for contact/verification

  @Column({ nullable: false })
  address: string; // Optional, user’s address

  @Column({
    nullable: false,
    default: 'user',
    enum: ['user', 'admin'],
    type: 'simple-array',
  })
  role: string[]; // user / admin

  @Column({
    nullable: false,
    default: 'active',
    enum: ['suspended', 'active', 'inactive'],
  })
  status: string; // active / inactive / suspended

  @Column({ nullable: false, default: new Date(), type: 'timestamp' })
  createdAt: Date; // Account creation date

  @Column({ nullable: false, default: new Date(), type: 'timestamp' })
  updatedAt: Date; // Last profile update
}
