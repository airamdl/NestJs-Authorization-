import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { Ability } from '@casl/ability';
import { Action } from '../enum/actionArticle.enum';
import { UserEntity } from '../entities/user.entity';
import { log } from 'console';
import { ForbiddenException } from '@nestjs/common';



const mockUserService = {
  createUser: jest.fn(),
  findAllUsers: jest.fn(),
  findUserById: jest.fn(),
  remove: jest.fn(),
};

const mockCaslAbilityFactory = {
  createForUser: jest.fn((user) => ({
    can: jest.fn().mockReturnValue(user.isAdmin),
    throwUnlessCan: jest.fn(),
  })),
};

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let caslAbilityFactory: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: CaslAbilityFactory,
          useValue: mockCaslAbilityFactory
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    caslAbilityFactory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  // it('should allow creation if permissions are granted', async () => {
  //   const mockUser: UserEntity = {
  //     id: 1,
  //     isAdmin: true,
  //     username: 'testUser',
  //     email: 'test@example.com',
  //     password: 'securePassword'
  //   };
  //   const createdUserDto = {
  //     id: 1,
  //     isAdmin: true,
  //     username: 'testUser',
  //     email: 'test@example.com',
  //     password: 'securePassword'};  
  //   const req = { user: mockUser };

  //   expect(createdUserDto).toEqual(req.user)
  //   expect(caslAbilityFactory.createForUser(req.user).can).toHaveBeenCalled();
  // });

  it('should call can method of CaslAbilityFactory', async () => {
    const mockUser: UserEntity = {
      id: 1,
      isAdmin: true,
      username: 'testUser',
      email: 'test@example.com',
      password: 'securePassword'
    };
    const createUserDto = { username: 'testUser', email: 'test@example.com', password: 'securePassword', id:1, isAdmin: true};
    const req = { user: mockUser  };  

    await controller.create(createUserDto, req);

    expect(caslAbilityFactory.createForUser).toHaveBeenCalledWith(req.user);

    expect(caslAbilityFactory.createForUser(req.user).can).toBeDefined
    expect(caslAbilityFactory.createForUser(req.user).can).toHaveBeenCalled
    
});


it('should reject when non-admin user tries to create a user', async () => {
  const createUserDto = { id: 15, isAdmin: false, username: 'newuser', email: 'user@example.com', password: 'pass123' };
  const req = { user: { id: 1, isAdmin: false, username: 'regularuser', email: 'regularuser@example.com', password: 'pass' } };

  
  
  await expect(controller.create(createUserDto, req)).rejects
});
});




 