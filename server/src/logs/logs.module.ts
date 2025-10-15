import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';

const consoleTransports = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, context }) => {
      return `${timestamp} [${context}] ${level}: ${message}`;
    }),
  ),
})

const errorLogTransports = new winston.transports.File({
  filename: 'logs/error.log',
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.json(),
  ),
})

const combinedLogTransports = new winston.transports.File({
  filename: 'logs/combined.log',
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.json(),
  ),
})


@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isLogOn = configService.get<boolean>('log.on')
        const transports = [consoleTransports, ...(isLogOn ? [errorLogTransports, combinedLogTransports] : [])]
        return {
          transports
        }
      },
    }),
  ]
})
export class LogsModule { }