import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType } from '../../entities/Account.entity';
import { Type } from 'class-transformer';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The ID of the user who owns this account',
    format: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Type of bank account',
    enum: ['savings', 'checking', 'current'],
    example: 'savings',
  })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiPropertyOptional({
    description: 'Currency code in ISO 4217 format',
    default: 'USD',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Branch code where the account was opened',
    example: 'NYC001',
  })
  @IsString()
  @IsOptional()
  branchCode?: string;

  @ApiPropertyOptional({
    description: 'Custom nickname for the account',
    example: 'My Savings',
  })
  @IsString()
  @IsOptional()
  accountNickname?: string;

  @ApiPropertyOptional({
    description: 'Interest rate for savings accounts',
    minimum: 0,
    maximum: 100,
    example: 2.5,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  interestRate?: number;

  @ApiPropertyOptional({
    description: 'Maximum overdraft limit for the account',
    minimum: 0,
    example: 1000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  overdraftLimit?: number;
}
