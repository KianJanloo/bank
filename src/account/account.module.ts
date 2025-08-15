import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'djdddddddddddddddddddddjdiehdoifgwnogiufgheor384374873874837483748lvkjbohywf',
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
