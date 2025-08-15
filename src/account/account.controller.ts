import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { LoginDto } from './dto/login-account-dto';
import { JwtAuthGuard } from 'src/jwt-auth-guard/jwt-auth-guard.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @Post('/amount/:id')
  @UseGuards(JwtAuthGuard)
  addAmount(@Param('id') id: string, @Body('amount') amount: string) {
    return this.accountService.addAmountToAccount(+id, amount);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.accountService.login(loginDto);
  }
}
