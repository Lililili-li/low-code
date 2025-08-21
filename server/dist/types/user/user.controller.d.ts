import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '@nestjs/common';
export declare class UserController {
    private readonly userService;
    private readonly logger;
    constructor(userService: UserService, logger: LoggerService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): string;
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
    findProfile(id: string): Promise<import("./dto/create-user.vo").CreateUserVo | null>;
}
