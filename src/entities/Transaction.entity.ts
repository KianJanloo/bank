import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Account } from './Account.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum Initiator {
  USER = 'user',
  ADMIN = 'admin',
  SYSTEM = 'system',
}

@Entity('transactions')
@ApiTags('Transactions')
export class Transaction {
  @ApiProperty({ format: 'uuid', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @ApiProperty({ type: () => Account, description: 'Source account' })
  @ManyToOne(() => Account, (account) => account.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ApiProperty({ format: 'uuid', description: 'Source account ID' })
  @Column('uuid')
  accountId: string;

  @ApiProperty({
    enum: TransactionType,
    description: 'Type of transaction',
  })
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description: 'Transaction amount',
    minimum: 0.01,
  })
  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Currency code in ISO 4217 format',
    default: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @ApiProperty({
    enum: ['pending', 'completed', 'failed'],
    description: 'Transaction status',
    default: 'pending',
  })
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ApiPropertyOptional({ description: 'Transaction reference number' })
  @Column({ nullable: true })
  reference: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Destination account ID for transfers',
  })
  @Column({ type: 'uuid', nullable: true })
  relatedAccountId: string;

  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description: 'Transaction fee',
    default: 0,
    minimum: 0,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  transactionFee: number;

  @ApiPropertyOptional({ description: 'Additional transaction notes' })
  @Column({ nullable: true })
  notes: string;

  @ApiProperty({
    enum: ['user', 'admin', 'system'],
    description: 'Who initiated the transaction',
    default: 'user',
  })
  @Column({ type: 'enum', enum: Initiator, default: Initiator.USER })
  initiatedBy: Initiator;

  @ApiProperty({ description: 'Transaction creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
