import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateUserVo } from './dto/create-user.vo';
export declare class UserService {
    private readonly userRepository;
    private readonly profileRepository;
    constructor(userRepository: Repository<User>, profileRepository: Repository<Profile>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): string;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
    findProfile(id: number): Promise<CreateUserVo | null>;
}
