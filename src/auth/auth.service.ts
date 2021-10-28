import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ProfileModel } from '../profile/profile.model';
import { Types } from 'mongoose';

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

        const newProfile = await this.profileModel.create({_id: new Types.ObjectId()})

        const newUser = await this.userModel.create({
            email: dto.login,
            passwordHash: await hash(dto.password, salt),
            profile: newProfile._id
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

    async test() {
        const login = '3'

        return this.userModel
            .find({email: login})
            .populate({path: 'profile', model: ProfileModel})
            .exec()
    }
}
