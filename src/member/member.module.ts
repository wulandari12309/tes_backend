import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Member } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])], // Menggunakan TypeORM dengan entity 'Member'
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
