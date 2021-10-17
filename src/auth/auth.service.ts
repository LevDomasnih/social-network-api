import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async createUser(dto: AuthDto) {
        const salt = await genSalt(10)

        return this.usersService.createUser(dto, salt)
    }

    async findUser(email: string) {
        return this.usersService.findUser(email)
    }

    async validateUser(email: string, password: string) {
        const user = await this.findUser(email)
        if (!user) {
            throw new UnauthorizedException('Данного пользователя не существует')
        }
        const isCorrectPassword = await compare(password, user.passwordHash)
        if (!isCorrectPassword) {
            throw new UnauthorizedException('Неверный пароль')
        }

        return {email: user.email}
    }

    async login(email: string) {
        const payload = { email }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
