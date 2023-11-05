import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbprismaService } from 'src/dbprisma/dbprisma.service';

//https://docs.nestjs.com/security/authentication#implementing-passport-jwt
//https://www.passportjs.org/packages/passport-jwt/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-custom') {
  constructor(
    config: ConfigService,
    private dbPrisma: DbprismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.dbPrisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete (user as any).password;
    return user;
  }
}
