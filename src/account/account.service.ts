import {
  HttpException,
  Injectable,
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
    private jwtService: JwtService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const accountFind = await this.accountRepository.findOne({
      where: {
        email: createAccountDto.email,
        phoneNumber: createAccountDto.phoneNumber,
        nationalCode: createAccountDto.nationalCode,
      },
    });
    if (accountFind) {
      throw new HttpException('Account already is defined', 409);
    }
    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);
    createAccountDto.password = hashedPassword;
    const account = this.accountRepository.create(createAccountDto);
    await this.accountRepository.save(account);
    return { account_id: account.id };
  }

  async findAll() {
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
  }

  async findOne(id: number) {
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
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    await this.accountRepository.update(id, updateAccountDto);
    const updatedAccount = await this.accountRepository.findOne({
      where: { id },
    });
    if (!updatedAccount) {
      throw new HttpException('Account not found', 404);
    }
    return updateAccountDto;
  }

  async remove(id: number) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new HttpException('Account not found', 404);
    }
    await this.accountRepository.remove(account);
    return {
      message: 'The account successfully removed by ID',
    };
  }

  async addAmountToAccount(id: number, amount: string) {
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
  }

  async removeAmountFromAccount(id: number, amount: string) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new HttpException('Account not found', 404);
    }
    if (amount > account.amount) {
      throw new HttpException('The amount is not enough', 420);
    }
    const amountFinally = parseFloat(account.amount) - parseFloat(amount);
    account.amount = amountFinally.toString();
    if (isNaN(amountFinally)) {
      account.amount = amount;
    }
    await this.accountRepository.save(account);
    return {
      id: account.id,
      amount: account.amount,
    };
  }

  async clearTheAccount(id: number) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new HttpException('Account not found', 404);
    }
    account.amount = '0';
    await this.accountRepository.save(account);
    return {
      id: account.id,
      amount: account.amount,
    };
  }

  async CardToCard(payerId: number, receiverId: number, amount: number) {
    const payerAccount = await this.accountRepository.findOne({
      where: { id: payerId },
    });
    const receiverAccount = await this.accountRepository.findOne({
      where: { id: receiverId },
    });
    if (!payerAccount) {
      throw new HttpException('Payer account not found', 404);
    }
    if (!receiverAccount) {
      throw new HttpException('Receiver account not found', 404);
    }

    if (parseFloat(payerAccount.amount) < amount) {
      throw new HttpException(
        'Amount of payer account is not enough for this way payment (card to card)',
        420,
      );
    }
    payerAccount.amount = String(parseFloat(payerAccount.amount) - amount);
    receiverAccount.amount = String(
      parseFloat(receiverAccount.amount) + amount,
    );

    await this.accountRepository.save(payerAccount);
    await this.accountRepository.save(receiverAccount);
    return {
      massage: 'The operator successfully completed',
      payerAmount: payerAccount.amount,
      receiverAmount: receiverAccount.amount,
    };
  }

  async login(loginDto: LoginDto) {
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
      roles: account.roles,
    });
  }

  private generateTokens(user: {
    id: number;
    email: string;
    phoneNumber: string;
    roles: string[];
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
