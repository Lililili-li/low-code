"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("./user/user.module");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./configuration");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user/entities/user.entity");
const logs_entity_1 = require("./logs/entities/logs.entity");
const roles_entity_1 = require("./roles/entities/roles.entity");
const profile_entity_1 = require("./user/entities/profile.entity");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default]
            }),
            nest_winston_1.WinstonModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    transports: [
                        new winston.transports.Console({
                            format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context }) => {
                                return `${timestamp} [${context}] ${level}: ${message}`;
                            })),
                        }),
                        new winston.transports.File({
                            filename: 'logs/error.log',
                            level: 'error',
                            format: winston.format.combine(winston.format.timestamp({
                                format: "YYYY-MM-DD HH:mm:ss"
                            }), winston.format.json()),
                        }),
                        new winston.transports.File({
                            filename: 'logs/combined.log',
                            format: winston.format.combine(winston.format.timestamp({
                                format: "YYYY-MM-DD HH:mm:ss"
                            }), winston.format.json()),
                        }),
                    ],
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return {
                        type: 'mysql',
                        host: configService.get('db.url'),
                        port: configService.get('db.port'),
                        username: configService.get('db.userName'),
                        password: configService.get('db.password')?.toString(),
                        database: configService.get('db.database'),
                        synchronize: configService.get('db.synchronize'),
                        logging: ['error'],
                        entities: [user_entity_1.User, logs_entity_1.Logs, roles_entity_1.Roles, profile_entity_1.Profile]
                    };
                }
            }),
            user_module_1.UserModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map