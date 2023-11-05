import { Injectable, ForbiddenException } from '@nestjs/common';
import { DbprismaService } from 'src/dbprisma/dbprisma.service';
import { UserDTO, UserLoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private dbPrisma: DbprismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: UserDTO) {
    const hashedPw = await argon.hash(dto.password);
    try {
      const user = await this.dbPrisma.user.create({
        data: {
          email: dto.email,
          password: hashedPw,
          phone: dto.phone,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      delete (user as any).password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already taken');
        }
      }
      throw error;
    }
  }

  async login(dto: UserLoginDto): Promise<{ access_token: string }> {
    const user = await this.dbPrisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incoretct');
    const pwEquals = await argon.verify(user.password, dto.password);
    if (!pwEquals) throw new ForbiddenException('Credentials incoretct');
    const accessToken = await this.createJwtToken(user.id, user.email);
    return {
      access_token: accessToken,
    };
  }

  async createJwtToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
