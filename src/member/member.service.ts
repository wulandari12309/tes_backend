import { Injectable } from '@nestjs/common';
import { Member } from './entities/member.entity';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class MemberService {
  private members: Member[] = [];
  private books: Book[] = [];
  private penalties: Map<string, Date> = new Map();

  async create(member: Member): Promise<Member> {
    this.members.push(member);
    return member;
  }

  async findAll(): Promise<Member[]> {
    return this.members;
  }

  async borrowBook(memberCode: string): Promise<string> {
    const member = this.members.find((m) => m.code === memberCode);
    if (!member) {
      throw new Error('Member not found');
    }

    if (this.penalties.has(memberCode)) {
      const penaltyEndDate = this.penalties.get(memberCode);
      if (penaltyEndDate && new Date() < penaltyEndDate) {
        throw new Error('Member is currently penalized');
      }
    }

    if (member.borrowedBooks.length >= 2) {
      throw new Error('Cannot borrow more than 2 books');
    }

    const availableBooks = this.books.filter((book) => book.stock > 0);
    if (availableBooks.length === 0) {
      throw new Error('No books available for borrowing');
    }

    const bookToBorrow = availableBooks[0];
    bookToBorrow.stock -= 1;
    member.borrowedBooks.push(bookToBorrow);
    return 'Book borrowed successfully';
  }

  async returnBook(
    memberCode: string,
    bookCode: string,
    returnDate: Date,
  ): Promise<string> {
    const member = this.members.find((m) => m.code === memberCode);
    if (!member) {
      throw new Error('Member not found');
    }

    const borrowedBooks = member.borrowedBooks || [];
    const bookIndex = borrowedBooks.findIndex((b) => b.code === bookCode);
    if (bookIndex === -1) {
      throw new Error('Book not found in borrowed list');
    }

    const bookToReturn = borrowedBooks[bookIndex];
    const daysLate = Math.max(
      0,
      Math.floor(
        (returnDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      ) - 7,
    );
    if (daysLate > 0) {
      this.penalties.set(
        memberCode,
        new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
      ); // 3 days penalty
    }

    bookToReturn.stock += 1;
    borrowedBooks.splice(bookIndex, 1);
    member.borrowedBooks = borrowedBooks;
    return 'Book returned successfully';
  }
}
