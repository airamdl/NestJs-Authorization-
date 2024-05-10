import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { SignInDto } from 'src/auth/dto/signin-user.dto';
import * as bcrypt from 'bcrypt'

// import { UserProfile } from './userProfile.service';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
   
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, await bcrypt.genSalt());

    await this.userRepository.save(user);
    return user;
  }

  async loginUser(signInDto: SignInDto): Promise<boolean> {
    const user = await this.findByUsername(signInDto.username)
    if (!await bcrypt.compare(signInDto.password, user.password)) {
      return false
    }
    return true;
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username: username } })
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }






}
