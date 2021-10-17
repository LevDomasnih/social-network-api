import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../profile/profile.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly profileService: ProfileService
    ) { }

    async getUserById(id: string) {
        return this.userModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            { $addFields: { "id": { "$toString": "$_id" }}},
            {
                $lookup: {
                    from: 'Profile',
                    localField: 'id',
                    foreignField: 'profileId',
                    as: 'profile'
                }
            },
            {
                $addFields: {
                    "profile": {
                        "$arrayElemAt": [ "$profile", 0 ],
                    },
                }
            },
            {
                $unset: [
                    'passwordHash',
                    'createdAt',
                    'updatedAt',
                    'id',
                    '__v',
                    'profile.profileId',
                    'profile.createdAt',
                    'profile.updatedAt',
                    'profile._id',
                    'profile.__v',
                ]
            }
        ])
            .then(user => user[0])
    }

    async findUser(email: string) {
        return this.userModel.findOne({email}).exec()
    }

    async createUser(dto: AuthDto, salt: string) {
        const newUser = new this.userModel({
            email: dto.login,
            passwordHash: await hash(dto.password, salt)
        })

        await newUser.save()
        const profile = await this.profileService.createProfile(newUser._id.toString(), dto.login)

        return {
            newUser,
            profile
        }
    }
}
