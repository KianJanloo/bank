// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Account } from './Account.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @ApiProperty({ format: 'uuid', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @ApiProperty({ description: "User's first name" })
  @Column()
  firstName: string;

  @ApiProperty({ description: "User's last name" })
  @Column()
  lastName: string;

  @ApiProperty({ description: "User's email address", uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Hashed password', writeOnly: true })
  @Column()
  password: string;

  @ApiPropertyOptional({ description: "User's phone number" })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiPropertyOptional({ description: "User's address" })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    description: "User's role",
    enum: ['user', 'admin'],
    default: 'user',
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({
    description: "User's account status",
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiPropertyOptional({ description: "User's date of birth" })
  @Column({ nullable: true })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Two-factor authentication status',
    default: false,
  })
  @Column({ default: false })
  twoFactorEnabled: boolean;

  @ApiPropertyOptional({ description: "URL to user's profile picture" })
  @Column({ nullable: true })
  profilePicture: string;

  @ApiPropertyOptional({ description: 'Last login timestamp' })
  @Column({ nullable: true })
  lastLogin: Date;

  @ApiProperty({ description: "User's bank accounts", type: () => [Account] })
  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @ApiProperty({ description: 'Account creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
