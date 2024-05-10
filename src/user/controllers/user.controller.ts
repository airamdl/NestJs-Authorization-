import { Controller, Get, Post, Param, Delete, ParseIntPipe, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/rol.enum';
import { Public } from '../../auth/decorators/public.decorators';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../enum/actionArticle.enum';
import { UserEntity } from '../entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags("Users")
@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private abilityFactory: CaslAbilityFactory
  ) { }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post()
  create(createUserDto: CreateUserDto, @Request() req) {
 
    const ability = this.abilityFactory.createForUser(createUserDto)
    const isAllowed = ability.can(Action.Create, UserEntity)
    try {
      ForbiddenError.from(ability)
        .throwUnlessCan(Action.Create, UserEntity);
      return this.userService.createUser(createUserDto)
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new ForbiddenException({ 'error': e.message })
      }
    }
  }

  @Public()
  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findUserById(+id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }
}
