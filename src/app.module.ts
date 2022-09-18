import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://blog:myblog123123@0.0.0.0:27017/myBlogDb`,
    ),
    ConfigModule.forRoot({ envFilePath: './.env', isGlobal: true }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
