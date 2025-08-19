import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../entities/Transaction.entity';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountsService: AccountsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const account = await this.accountsService.findOne(
        createTransactionDto.accountId,
      );

      const transaction = this.transactionRepository.create({
        ...createTransactionDto,
        status: TransactionStatus.PENDING,
      });

      // Process transaction based on type
      switch (transaction.type) {
        case TransactionType.DEPOSIT:
          await this.accountsService.updateBalance(
            account.accountId,
            transaction.amount,
          );
          break;
        case TransactionType.WITHDRAWAL:
          await this.accountsService.updateBalance(
            account.accountId,
            -transaction.amount,
          );
          break;
        case TransactionType.TRANSFER: {
          if (!createTransactionDto.relatedAccountId) {
            throw new BadRequestException(
              'Related account ID is required for transfers',
            );
          }
          const destinationAccount = await this.accountsService.findOne(
            createTransactionDto.relatedAccountId,
          );
          await this.accountsService.updateBalance(
            account.accountId,
            -transaction.amount,
          );
          await this.accountsService.updateBalance(
            destinationAccount.accountId,
            transaction.amount,
          );
          break;
        }
        default:
          throw new BadRequestException('Invalid transaction type');
      }

      transaction.status = TransactionStatus.COMPLETED;
      const savedTransaction =
        await this.transactionRepository.save(transaction);
      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['account'],
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId: id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async findByAccount(accountId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { accountId },
      relations: ['account'],
    });
  }

  // Note: Transactions should not be updated or removed in a production environment
  // These methods are included for completeness but should be restricted
  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id);
    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed transactions');
    }
    Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('Cannot remove completed transactions');
    }
    await this.transactionRepository.remove(transaction);
  }
}
