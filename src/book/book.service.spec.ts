import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

const mockBookRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('BookService', () => {
  let service: BookService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository(),
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', async () => {
    const book = {
      id: 1,
      code: 'HP-001',
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      stock: 2,
    };
    (repository.save as jest.Mock).mockResolvedValue(book);

    expect(await service.create(book)).toEqual(book);
    expect(repository.save).toHaveBeenCalledWith(book);
  });

  it('should find all books', async () => {
    const books = [
      {
        id: 1,
        code: 'HP-001',
        title: 'Harry Potter',
        author: 'J.K. Rowling',
        stock: 2,
      },
    ];
    (repository.find as jest.Mock).mockResolvedValue(books);

    expect(await service.findAll()).toEqual(books);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should check availability of a book', async () => {
    const book = { id: 1, code: 'HP-001', stock: 1 };
    (repository.findOne as jest.Mock).mockResolvedValue(book);

    expect(await service.checkAvailability('HP-001')).toEqual(true);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { code: 'HP-001' },
    });
  });
});
