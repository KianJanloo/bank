// src/entities/Account.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Transaction } from './Transaction.entity';

export type AccountType = 'savings' | 'checking' | 'current';
export type AccountStatus = 'active' | 'closed' | 'frozen';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @ManyToOne(() => User, (user) => user.accounts, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column({ unique: true })
  accountNumber: string;

  @Column({ type: 'enum', enum: ['savings', 'checking', 'current'] })
  accountType: AccountType;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['active', 'closed', 'frozen'],
    default: 'active',
  })
  status: AccountStatus;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  interestRate: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true, default: 0 })
  overdraftLimit: number;

  @Column({ nullable: true })
  branchCode: string;

  @Column({ nullable: true })
  accountNickname: string;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
