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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../jwt-auth-guard/jwt-auth-guard.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Transaction } from '../entities/Transaction.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<Transaction[]> {
    return await this.transactionsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Transaction> {
    return await this.transactionsService.findOne(id);
  }

  @Get('account/:accountId')
  @Roles('admin', 'user')
  async findByAccount(
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ): Promise<Transaction[]> {
    return await this.transactionsService.findByAccount(accountId);
  }

  // Note: In a production environment, updating or deleting transactions
  // should typically not be allowed. These endpoints are restricted to admin only.
  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return await this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.transactionsService.remove(id);
  }
}
