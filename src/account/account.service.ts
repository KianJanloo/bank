import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
import { Account } from 'src/entities/Account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-account-dto';
import {
  generateAccessToken,
  generateRefreshToken,
} from 'src/utils/token-service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);
      createAccountDto.password = hashedPassword;
      const account = this.accountRepository.create(createAccountDto);
      await this.accountRepository.save(account);
      return account;
    } catch {
      throw new InternalServerErrorException('Error creating account');
    }
  }

  async findAll() {
    try {
      const accounts = await this.accountRepository.find({
        select: [
          'id',
          'email',
          'nationalCode',
          'firstName',
          'lastName',
          'fullname',
          'amount',
        ],
      });
      return accounts;
    } catch {
      throw new InternalServerErrorException('Error finding accounts');
    }
  }

  async findOne(id: number) {
    try {
      const account = await this.accountRepository.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'nationalCode',
          'firstName',
          'lastName',
          'fullname',
          'amount',
        ],
      });
      if (!account) {
        throw new HttpException('Account not found', 404);
      }
      return account;
    } catch {
      throw new InternalServerErrorException('Error finding account');
    }
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    try {
      await this.accountRepository.update(id, updateAccountDto);
      const updatedAccount = await this.accountRepository.findOne({
        where: { id },
      });
      if (!updatedAccount) {
        throw new HttpException('Account not found', 404);
      }
      return updatedAccount;
    } catch {
      throw new InternalServerErrorException('Error updating account');
    }
  }

  async remove(id: number) {
    try {
      const account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new HttpException('Account not found', 404);
      }
      await this.accountRepository.remove(account);
      return account;
    } catch {
      throw new InternalServerErrorException('Error deleting account');
    }
  }

  async addAmountToAccount(id: number, amount: string) {
    try {
      const account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new HttpException('Account not found', 404);
      }
      const amountFinally = parseFloat(account.amount) + parseFloat(amount);
      account.amount = amountFinally.toString();
      if (isNaN(amountFinally)) {
        account.amount = amount;
      }
      await this.accountRepository.save(account);
      return {
        id: account.id,
        amount: account.amount,
      };
    } catch {
      throw new InternalServerErrorException('Error adding amount to account');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const account = await this.accountRepository.findOne({
        where: { email: loginDto.email },
      });
      if (!account) {
        throw new HttpException('Account not found', 401);
      }
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        account.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', 401);
      }
      const accessToken = generateAccessToken(account);
      const refreshToken = generateRefreshToken(account);
      return {
        accessToken,
        refreshToken,
      };
    } catch {
      throw new InternalServerErrorException('Error logging in');
    }
  }
}
