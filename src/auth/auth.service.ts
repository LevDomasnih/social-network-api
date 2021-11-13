import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRequestDto } from './dto/auth-request.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ProfileModel } from '../profile/profile.model';
import { Types } from 'mongoose';
import { FollowModel } from '../follow/follow.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(ProfileModel) private readonly profileModel: ModelType<ProfileModel>,
        @InjectModel(FollowModel) private readonly followModel: ModelType<FollowModel>,
        private readonly jwtService: JwtService
    ) {
    }

    async createUser(dto: AuthRequestDto) {
        const salt = await genSalt(10);

        const userId = new Types.ObjectId()

        const newProfile = await this.profileModel.create({
            _id: new Types.ObjectId(),
            owner: userId
        })
        const newFollow = await this.followModel.create({
            _id: new Types.ObjectId(),
            userId
        })

        return this.userModel.create({
            _id: userId,
            email: dto.login,
            passwordHash: await hash(dto.password, salt),
            profile: newProfile._id,
            follow: newFollow._id
        });
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

    async verifyUser(token: string, options = {}) {
        try {
            const decodeData = await this.jwtService.verifyAsync(token.split(' ')[1]);

            const user = await this.userModel.findOne({email: decodeData.email, options}).exec()

            if (!user) {
                throw new BadRequestException('Данного пользователя не существует');
            }

            return user
        } catch (e) {
            throw new BadRequestException(e);
        }
    }
}
