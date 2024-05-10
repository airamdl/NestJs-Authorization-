import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../dto/signin-user.dto';
import { Public } from '../decorators/public.decorators';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("auth")

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)

  @Post('login')
  signIn(@Body() sigInDto: SignInDto) {
    return this.authService.signIn(sigInDto)
  }

  @Public()
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }





}
