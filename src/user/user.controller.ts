import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserLoginDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private authService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: UserDTO) {
    const user = await this.authService.register(dto);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    const user = await this.authService.login(dto);
    return user;
  }
}
