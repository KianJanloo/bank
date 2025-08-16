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
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @Post('/amount/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addAmount(@Param('id') id: string, @Body('amount') amount: string) {
    return this.accountService.addAmountToAccount(+id, amount);
  }

  @Delete('/amount/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  removeAmount(@Param('id') id: string, @Body('amount') amount: string) {
    return this.accountService.removeAmountFromAccount(+id, amount);
  }

  @Delete('/amount/clear/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  clearAccount(@Param('id') id: string) {
    return this.accountService.clearTheAccount(+id);
  }

  @Post('/card-to-card/:payerId/:receiverId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  cardToCard(
    @Param() params: { payerId: string; receiverId: string },
    @Body('amount') amount: string,
  ) {
    const { payerId, receiverId } = params;
    return this.accountService.CardToCard(+payerId, +receiverId, +amount);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.accountService.login(loginDto);
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }
}
