import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Account {
  @PrimaryColumn({ type: 'uuid' })
  accountId: string; // Unique identifier for the account

  @Column({ nullable: false })
  accountNumber: string; // Unique human-readable account number

  @ManyToOne(() => User, (user) => user.id)
  @Column({ nullable: false })
  userId: number; // Foreign key linking to the User who owns the account

  @Column({
    nullable: false,
    enum: ['savings', 'checking', 'current'],
    default: 'current',
  })
  accountType: string; // savings / checking / current

  @Column({ nullable: false, type: 'decimal' })
  balance: number; // Current balance of the account

  @Column({ nullable: false, default: 'USD' })
  currency: string; // e.g., USD, EUR

  @Column({
    nullable: false,
    enum: ['active', 'closed', 'frozen'],
    default: 'active',
  })
  status: string; // active / closed / frozen

  @Column({ nullable: false, default: new Date() })
  createdAt: Date; // Account creation date

  @Column({ nullable: false, default: new Date() })
  updatedAt: Date; // Last update timestamp

  @Column({ nullable: true, type: 'decimal' })
  interestRate?: number; // Optional, if it’s a savings account
}
