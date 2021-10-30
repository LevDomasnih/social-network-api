import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
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

    async createUser(dto: AuthDto) {
        const salt = await genSalt(10);

        const newProfile = await this.profileModel.create({_id: new Types.ObjectId()})
        const newFollow = await this.followModel.create({_id: new Types.ObjectId()})

        const newUser = await this.userModel.create({
            email: dto.login,
            passwordHash: await hash(dto.password, salt),
            profile: newProfile._id,
            follow: newFollow._id
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
        const login = '10'

        //617d7bf8b25c11cb5a988c7c

        const x = await this.userModel.findById('617d7bf8b25c11cb5a988c7c')

        // @ts-ignore
        // tslint:disable-next-line:max-line-length
        // const z = await this.followModel .findOneAndUpdate( { _id: '617d84b6bec142d22dfee146' }, { $push: {followUser: x._id}},
        //         {new: true}
        //     )
        //     .exec()
        //
        // return this.followModel.findById('617d84b6bec142d22dfee146')
        //     .populate({path: 'followUser', model: UserModel})



        return this.userModel
            .find({email: login})
            .populate({path: 'profile', model: ProfileModel})
            .populate({path: 'follow', model: FollowModel, select: 'followUser'})
            .exec()
    }
}
