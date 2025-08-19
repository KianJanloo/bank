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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth('bearer')
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles('admin', 'user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a transaction (deposit, withdrawal, transfer)',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created',
    type: Transaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or business rule violation',
  })
  async create(
    @Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [Transaction],
  })
  async findAll(): Promise<Transaction[]> {
    return await this.transactionsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Transaction> {
    return await this.transactionsService.findOne(id);
  }

  @Get('account/:accountId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'List transactions for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'List of account transactions',
    type: [Transaction],
  })
  async findByAccount(
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ): Promise<Transaction[]> {
    return await this.transactionsService.findByAccount(accountId);
  }

  // Note: In a production environment, updating or deleting transactions
  // should typically not be allowed. These endpoints are restricted to admin only.
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Update a transaction (admin only, not recommended in production)',
  })
  @ApiParam({ name: 'id', description: 'Transaction ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Updated transaction',
    type: Transaction,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return await this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a transaction (admin only, not recommended in production)',
  })
  @ApiParam({ name: 'id', description: 'Transaction ID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Transaction deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.transactionsService.remove(id);
  }
}
