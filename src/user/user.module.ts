import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]), LoggerModule.forRoot()],
  controllers: [UserController],
  providers: [UserService,],
})
export class UserModule {}
