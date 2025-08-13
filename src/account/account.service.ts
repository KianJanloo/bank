import { HttpException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
import { Account } from 'src/entities/Account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const account = this.accountRepository.create(createAccountDto);
      await this.accountRepository.save(account);
      return account;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll() {
    try {
      const accounts = await this.accountRepository.find();
      return accounts;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      const account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new HttpException('Account not found', 404);
      }
      return account;
    } catch (error) {
      throw new HttpException(error, 500);
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
      throw new HttpException(error, 500);
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
      throw new HttpException(error, 500);
    }
  }
}
