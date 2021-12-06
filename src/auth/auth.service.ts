import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRegisterRequestDto } from './dto/auth-register-request.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ProfileModel } from '../profile/profile.model';
import { Types } from 'mongoose';
import { FollowModel } from '../follow/follow.model';
import { AuthLoginRequestDto } from './dto/auth-login-request.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(ProfileModel) private readonly profileModel: ModelType<ProfileModel>,
        @InjectModel(FollowModel) private readonly followModel: ModelType<FollowModel>,
        private readonly jwtService: JwtService
    ) {
    }

    async login({email, password}: AuthLoginRequestDto) {
        await this.validateUser(email, password);
        return this.createAccessToken(email)
    }

    async register(dto: AuthRegisterRequestDto) {
        const oldUser = await this.findUser(dto.email);

        if (oldUser) {
            throw new BadRequestException('Данный пользователь уже зарегистрирован!');
        }

        return this.createUser(dto);
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

    private async createAccessToken(email: string) {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    private async createUser({ email, password, ...dto }: AuthRegisterRequestDto) {
        const salt = await genSalt(10);

        const userId = new Types.ObjectId()

        try {
            const newProfile = await this.profileModel.create({
                _id: new Types.ObjectId(),
                owner: userId,
                ...dto
            })
            const newFollow = await this.followModel.create({
                _id: new Types.ObjectId(),
                userId
            })

            await this.userModel.create({
                _id: userId,
                email,
                passwordHash: await hash(password, salt),
                profile: newProfile._id,
                follow: newFollow._id
            });

            return this.createAccessToken(email)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    private async findUser(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    private async validateUser(email: string, password: string) {
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
}
