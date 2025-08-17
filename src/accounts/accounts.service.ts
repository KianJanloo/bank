import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from '../entities/Account.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly usersService: UsersService,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const user = await this.usersService.findOne(createAccountDto.userId);

    const account = this.accountRepository.create({
      ...createAccountDto,
      user,
      accountNumber: this.generateAccountNumber(),
      balance: 0,
    });

    return await this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find({
      relations: ['user', 'transactions'],
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { accountId: id },
      relations: ['user', 'transactions'],
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  async findByUser(userId: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { userId },
      relations: ['transactions'],
    });
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    Object.assign(account, updateAccountDto);
    return await this.accountRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    if (account.balance > 0) {
      throw new BadRequestException(
        'Cannot close account with positive balance',
      );
    }
    await this.accountRepository.remove(account);
  }

  async updateBalance(accountId: string, amount: number): Promise<Account> {
    const account = await this.findOne(accountId);
    const newBalance = account.balance + amount;

    if (newBalance < -account.overdraftLimit) {
      throw new BadRequestException('Insufficient funds');
    }

    account.balance = newBalance;
    return await this.accountRepository.save(account);
  }

  private generateAccountNumber(): string {
    // Generate a random 10-digit account number
    return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
  }
}
