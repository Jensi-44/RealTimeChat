import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existsUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existsUsername)
      throw new BadRequestException('Username already exists');

    const existsEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existsEmail) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { username, email, password: hashed },
    });

    return { message: 'Registered Successfully', user };
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new BadRequestException('Invalid username or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid username or password');

    const token = this.jwtService.sign({ id: user.id });

    return {
      message: 'Login Successful',
      user: { username: user.username },
      token,
    };
  }
}
