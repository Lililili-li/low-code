import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Logs } from './logs/entities/logs.entity';
import { Roles } from './roles/entities/roles.entity';
import { Profile } from './user/entities/profile.entity';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration as ConfigFactory]
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, context }) => {
                return `${timestamp} [${context}] ${level}: ${message}`;
              }),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
              winston.format.timestamp({
                format:"YYYY-MM-DD HH:mm:ss"
              }),
              winston.format.json(),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(
              winston.format.timestamp({
                format:"YYYY-MM-DD HH:mm:ss"
              }),
              winston.format.json(),
            ),
          }),
        ],
      }),
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
          entities: [ User, Logs, Roles, Profile ]
        }
      }
    }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
