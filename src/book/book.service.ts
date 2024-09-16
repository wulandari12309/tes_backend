import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(book: Partial<Book>): Promise<Book> {
    return await this.bookRepository.save(book as Book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async checkAvailability(code: string): Promise<boolean> {
    const book = await this.bookRepository.findOne({ where: { code } });
    return book ? book.stock > 0 : false;
  }
}
