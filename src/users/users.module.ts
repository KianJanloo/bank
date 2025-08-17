import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/User.entity';
import { AuthModule } from '../auth/auth.module';
import { GuardsModule } from '../guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, GuardsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
