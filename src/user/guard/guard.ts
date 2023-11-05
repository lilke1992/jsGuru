import { AuthGuard } from '@nestjs/passport';

export class JWTGuard extends AuthGuard('jwt-custom') {
  constructor() {
    super();
  }
}
