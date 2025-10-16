import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "../core/jwt/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from "@nestjs/config";
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [
                ConfigModule
            ],
            inject: [
                ConfigService],
            useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
                secret: configService.get<string>('JWT_SECRET', 'default_secret'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRED', '1d')
                },
            })
        })
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService, JwtStrategy
    ],
    exports: [
        AuthService,
        JwtStrategy, PassportModule
    ]
})
export class AuthModule { }