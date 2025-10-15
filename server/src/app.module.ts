import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Roles } from './roles/entities/roles.entity';
import { Profile } from './user/entities/profile.entity';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration as ConfigFactory]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('db.url'),
          port: configService.get<number>('db.port'),
          username: configService.get<string>('db.userName'),
          password: configService.get<string>('db.password')?.toString(),
          database: configService.get<string>('db.database'),
          synchronize: configService.get<boolean>('db.synchronize'),
          logging: ['error'],
          entities: [ User, Roles, Profile ]
        }
      }
    }),
    UserModule,
    LogsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
