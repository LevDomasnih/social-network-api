import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ProfileModel } from '../profile/profile.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(ProfileModel) private readonly profileModel: ModelType<ProfileModel>,
        private readonly jwtService: JwtService
    ) {
    }

    async createUser(dto: AuthDto) {
        const salt = await genSalt(10);

        const newUser = await this.userModel.create({
            email: dto.login,
            passwordHash: await hash(dto.password, salt),
            profile: await this.profileModel.create({ userId: dto.login})
        });

        return newUser
    }

    async findUser(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async validateUser(email: string, password: string) {
        const user = await this.findUser(email);
        if (!user) {
            throw new UnauthorizedException('Данного пользователя не существует');
        }
        const isCorrectPassword = await compare(password, user.passwordHash);
        if (!isCorrectPassword) {
            throw new UnauthorizedException('Неверный пароль');
        }

        return { email: user.email };
    }

    async login(email: string) {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
