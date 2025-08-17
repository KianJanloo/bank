import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../entities/Transaction.entity';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the account making the transaction',
    format: 'uuid',
  })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description: 'Type of transaction',
    enum: ['deposit', 'withdrawal', 'transfer'],
    example: 'deposit',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Amount of the transaction',
    minimum: 0.01,
    example: 100.0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

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
    description: 'Reference number or description for the transaction',
    example: 'PAYMENT-001',
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({
    description: 'ID of the receiving account for transfers',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  relatedAccountId?: string;

  @ApiPropertyOptional({
    description: 'Additional notes for the transaction',
    example: 'Monthly rent payment',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
