import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Account } from './Account.entity';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type Initiator = 'user' | 'admin' | 'system';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @ManyToOne(() => Account, (account) => account.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column('uuid')
  accountId: string;

  @Column({ type: 'enum', enum: ['deposit', 'withdrawal', 'transfer'] })
  type: TransactionType;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  reference: string;

  @Column({ type: 'uuid', nullable: true })
  relatedAccountId: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  transactionFee: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'system'], default: 'user' })
  initiatedBy: Initiator;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
