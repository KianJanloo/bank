import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
import { Account } from 'src/entities/Account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-account-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const accountFind = await this.accountRepository.findOne({
        where: {
          email: createAccountDto.email,
          phoneNumber: createAccountDto.phoneNumber,
        },
      });
      if (accountFind) {
        throw new HttpException('Account already is defined', 409);
      }
      const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);
      createAccountDto.password = hashedPassword;
      const account = this.accountRepository.create(createAccountDto);
      await this.accountRepository.save(account);
      return account.id;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error creating account');
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
          'phoneNumber',
        ],
      });
      return accounts;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error finding accounts');
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
          'phoneNumber',
        ],
      });
      if (!account) {
        throw new HttpException('Account not found', 404);
      }
      return account;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error finding account');
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
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error updating account');
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
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error deleting account');
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
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error adding amount to account',
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, phoneNumber, password } = loginDto;
      const whereCondition = email ? { email } : { phoneNumber };

      const account = await this.accountRepository.findOne({
        where: whereCondition,
      });

      if (!account) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.generateTokens({
        id: account.id,
        email: account.email,
        phoneNumber: account.phoneNumber,
      });
    } catch {
      throw new InternalServerErrorException('Login failed');
    }
  }

  private generateTokens(user: {
    id: number;
    email: string;
    phoneNumber: string;
  }) {
    const accessToken = this.jwtService.sign(user, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(user, {
      expiresIn: '15d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
