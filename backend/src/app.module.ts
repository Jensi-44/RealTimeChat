import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [AuthModule],
  providers: [PrismaService, ChatGateway],
})
export class AppModule {}
