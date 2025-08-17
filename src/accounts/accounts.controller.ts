import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../jwt-auth-guard/jwt-auth-guard.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Account } from '../entities/Account.entity';

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe()) createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return await this.accountsService.create(createAccountDto);
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<Account[]> {
    return await this.accountsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Account> {
    return await this.accountsService.findOne(id);
  }

  @Get('user/:userId')
  @Roles('admin', 'user')
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Account[]> {
    return await this.accountsService.findByUser(userId);
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return await this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.accountsService.remove(id);
  }
}
