import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { Book } from './book/entities/book.entity';
import { Member } from './member/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'library_db',
      entities: [Book, Member],
      synchronize: true,
    }),
    BookModule,
    MemberModule,
  ],
})
export class AppModule {}
