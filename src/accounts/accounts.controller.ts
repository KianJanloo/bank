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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth('bearer')
@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({ status: 201, description: 'Account created', type: Account })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  async create(
    @Body(new ValidationPipe()) createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return await this.accountsService.create(createAccountDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'List of accounts',
    type: [Account],
  })
  async findAll(): Promise<Account[]> {
    return await this.accountsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'id', description: 'Account ID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Account details', type: Account })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Account> {
    return await this.accountsService.findOne(id);
  }

  @Get('user/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'List accounts for a user' })
  @ApiParam({ name: 'userId', description: 'User ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'List of user accounts',
    type: [Account],
  })
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Account[]> {
    return await this.accountsService.findByUser(userId);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update an account' })
  @ApiParam({ name: 'id', description: 'Account ID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Updated account', type: Account })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return await this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an account' })
  @ApiParam({ name: 'id', description: 'Account ID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Account deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.accountsService.remove(id);
  }
}
