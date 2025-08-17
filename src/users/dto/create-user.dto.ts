import {
  IsEmail,
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsISO8601,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../entities/User.entity';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: "User's first name" })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "User's last name" })
  @IsString()
  lastName: string;

  @ApiProperty({ description: "User's email address" })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: "User's phone number" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: "User's address" })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: "User's role in the system",
    enum: ['user', 'admin'],
    default: 'user',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: "User's account status",
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({
    description: "User's date of birth in ISO 8601 format",
    example: '1990-01-01',
  })
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsISO8601()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: "URL to user's profile picture",
    pattern: '^https?://',
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;
}
