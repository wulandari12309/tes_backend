import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Book } from '../book/entities/book.entity';
import { Repository } from 'typeorm';

const mockMemberRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

const mockBookRepository = () => ({
  findOne: jest.fn(),
});

describe('MemberService', () => {
  let service: MemberService;
  let memberRepository: jest.Mocked<Repository<Member>>;
  let bookRepository: jest.Mocked<Repository<Book>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository(),
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository(),
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    ) as jest.Mocked<Repository<Member>>;
    bookRepository = module.get<Repository<Book>>(
      getRepositoryToken(Book),
    ) as jest.Mocked<Repository<Book>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a book successfully', async () => {
    const member = {
      code: 'M001',
      borrowedBooks: 1,
      isPenalized: false,
      borrowedDate: new Date(),
    };
    const book = { code: 'HP-001' };
    (memberRepository.findOne as jest.Mock).mockResolvedValue(member);
    (bookRepository.findOne as jest.Mock).mockResolvedValue(book);

    const returnDate = new Date();
    expect(await service.returnBook('M001', 'HP-001', returnDate)).toEqual(
      'Book returned successfully.',
    );
    expect(memberRepository.save).toHaveBeenCalledWith({
      ...member,
      borrowedBooks: 0,
      borrowedDate: null,
    });
  });

  it('should apply penalty if return is late', async () => {
    const member = {
      code: 'M001',
      borrowedBooks: 1,
      isPenalized: false,
      borrowedDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    };
    const book = { code: 'HP-001' };
    (memberRepository.findOne as jest.Mock).mockResolvedValue(member);
    (bookRepository.findOne as jest.Mock).mockResolvedValue(book);

    const returnDate = new Date();
    expect(await service.returnBook('M001', 'HP-001', returnDate)).toEqual(
      'Book returned late. Penalty applied.',
    );
    expect(memberRepository.save).toHaveBeenCalledWith({
      ...member,
      borrowedBooks: 0,
      isPenalized: true,
      borrowedDate: null,
    });
  });
});
