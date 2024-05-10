import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { SignInDto } from '../dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(sigInDto: SignInDto): Promise<{ access_token: string } & any> {
    const user = await this.usersService.findByUsername(sigInDto.username);
    // console.log(user);

    if (await this.usersService.loginUser(sigInDto)) {
      const payload = { user_id: user.id }
      return {
        user: user,
        access_token: await this.jwtService.signAsync(payload)
      }
    }
    return {
      error: 'credenciales incorrectas'

    }
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.createUser(createUserDto)
    const payload = { sub: user.id, username: user.username }
    console.log(user);
    
    return {
      "Created": "success",
      user,
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
