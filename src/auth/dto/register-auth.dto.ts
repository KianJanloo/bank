import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/entities/User.entity';

export class RegisterDto {
  @IsString()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsString()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'StrongPassword123!' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '+1234567890', required: false })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123 Main St', required: false })
  address?: string;

  @IsOptional()
  @IsEnum(['user', 'admin'])
  @ApiProperty({ example: 'user', enum: ['user', 'admin'], required: false })
  role?: UserRole;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  @ApiProperty({
    example: 'active',
    enum: ['active', 'inactive', 'suspended'],
    required: false,
  })
  status?: UserStatus;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '1990-01-01', required: false })
  dateOfBirth?: Date;

  @IsOptional()
  @ApiProperty({ example: false, required: false })
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'profile.jpg', required: false })
  profilePicture?: string;
}
