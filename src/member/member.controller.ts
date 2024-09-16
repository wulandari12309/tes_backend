import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './entities/member.entity';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() member: Member) {
    return this.memberService.create(member);
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Post('borrow/:code')
  borrowBook(@Param('code') memberCode: string) {
    return this.memberService.borrowBook(memberCode);
  }

  @Post('return/:code')
  returnBook(
    @Param('code') memberCode: string,
    @Body('bookCode') bookCode: string,
    @Body('returnDate') returnDate: string, // Ensure you pass the returnDate as a Date object
  ) {
    // Convert returnDate from string to Date if necessary
    const parsedReturnDate = new Date(returnDate);
    return this.memberService.returnBook(
      memberCode,
      bookCode,
      parsedReturnDate,
    );
  }
}
