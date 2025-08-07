import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateUserVo } from './dto/create-user.vo';

@Injectable()
export class UserService {
  constructor( 
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userObj = this.userRepository.create(createUserDto)
    const res = await this.userRepository.save(userObj)
    return res
  }

  async findAll() {
    const res =  await this.userRepository.find()
    return res
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findProfile(id: number) {
    let vo: CreateUserVo | null
    vo = await this.userRepository.findOne({
      where: {
        id
      },
    })
    if (vo) {
      vo.profile = await this.profileRepository.findOne({
        where: {
          userId: vo.id
        },
      }) as Record<string, any>
    }
    return vo
  }
}
