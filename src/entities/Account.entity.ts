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
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { User } from './User.entity';
import { Transaction } from './Transaction.entity';

export enum AccountType {
  SAVINGS = 'savings',
  CHECKING = 'checking',
  CURRENT = 'current',
}

export enum AccountStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  FROZEN = 'frozen',
}

@Entity('accounts')
@ApiTags('Accounts')
export class Account {
  @ApiProperty({ format: 'uuid', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @ApiProperty({ type: () => User, description: 'Account owner' })
  @ManyToOne(() => User, (user) => user.accounts, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ format: 'uuid', description: 'Owner user ID' })
  @Column('uuid')
  userId: string;

  @ApiProperty({ description: 'Unique account number' })
  @Column({ unique: true })
  accountNumber: string;

  @ApiProperty({
    enum: AccountType,
    description: 'Type of bank account',
  })
  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description: 'Current balance',
    default: 0,
  })
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  balance: number;

  @ApiProperty({
    description: 'Currency code in ISO 4217 format',
    default: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @ApiProperty({
    enum: AccountStatus,
    description: 'Status of bank account',
  })
  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @ApiPropertyOptional({
    type: 'number',
    format: 'decimal',
    description: 'Interest rate for savings accounts',
    minimum: 0,
    maximum: 100,
  })
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  interestRate: number;

  @ApiPropertyOptional({
    type: 'number',
    format: 'decimal',
    description: 'Maximum overdraft limit',
    minimum: 0,
  })
  @Column('decimal', { precision: 15, scale: 2, nullable: true, default: 0 })
  overdraftLimit: number;

  @ApiPropertyOptional({ description: 'Branch code where account was opened' })
  @Column({ nullable: true })
  branchCode: string;

  @ApiPropertyOptional({ description: 'Custom account nickname' })
  @Column({ nullable: true })
  accountNickname: string;

  @ApiProperty({
    type: () => [Transaction],
    description: 'Account transactions',
  })
  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
