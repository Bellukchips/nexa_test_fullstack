import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dtos/login.dto";
@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) {
    }
    async signToken(user_Id: string, username: string) {
        const payload = { sub: user_Id, username };
        return {
            access_token: this.jwt.sign(payload),
        };
    }

    async register(dto: RegisterDto) {
        const hashPassword = await bcrypt.hash(dto.password, 10);
        try {
            const user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    name: dto.name,
                    password: hashPassword,
                },
            });

            return this.signToken(user.id, user.username);

        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Username already exists');
            }
            throw error; // biar error lain tetap dilempar ke global filter
        }
    }
    async login(dto: LoginDto) {

        const user = await this.prisma.user.findUnique({
            where: {
                username: dto.username
            }
        });

        if (!user) throw new NotFoundException('User not found');

        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return this.signToken(user.id, user.username);
    }
}