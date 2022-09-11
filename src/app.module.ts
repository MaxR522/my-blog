import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://blog:myblog123123@$0.0.0.0:27017/myBlogDb`,
    ),
    ConfigModule.forRoot({ envFilePath: './.env', isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
