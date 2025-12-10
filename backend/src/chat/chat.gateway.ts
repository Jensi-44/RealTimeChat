import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private prisma: PrismaService,
  ) {}

  handleConnection(client: Socket) {
    console.log('🔌 Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('❌ Client disconnected:', client.id);
  }

  // 🟢 JOIN ROOM (sender + receiver)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    client: Socket,
    payload: { sender: string; receiver: string },
  ) {
    const roomId = [payload.sender, payload.receiver].sort().join('_');
    client.join(roomId);
    console.log('🟢 Joined Room:', roomId);
  }

  // ✉ PRIVATE MESSAGE + SAVE + EMIT
  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @MessageBody()
    data: {
      sender: string;
      receiver: string;
      text: string;
    },
  ) {
    const room = await this.chatService.getOrCreateRoom(
      data.sender,
      data.receiver,
    );

    const saved = await this.prisma.message.create({
      data: {
        roomId: room.id,
        senderId: data.sender,
        text: data.text,
      },
    });

    console.log('🔥 Emitting to room:', room.id, data);

    this.server.to(room.id).emit('privateMessage', {
      roomId: room.id,
      sender: data.sender,
      receiver: data.receiver,
      text: data.text,
      createdAt: saved.createdAt,
    });
  }
}
