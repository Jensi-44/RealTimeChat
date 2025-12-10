import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateRoom(user1: string, user2: string) {
    // Try to find existing room for this pair (user1-user2 OR user2-user1)
    let room = await this.prisma.chatRoom.findFirst({
      where: {
        OR: [
          { user1, user2 },
          { user1: user2, user2: user1 },
        ],
      },
    });

    // If no room found -> create new one
    if (!room) {
      room = await this.prisma.chatRoom.create({
        data: {
          user1,
          user2,
        },
      });
    }

    return room;
  }
}
