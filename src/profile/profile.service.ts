import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserModel } from '../users/user.model';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(ProfileModel) private readonly profileModel: ModelType<ProfileModel>,
    ) { }

    async updateProfile({userId, ...dto}: UpdateProfileDto) {
        return this.userModel
            .findOneAndUpdate(
            {userId},
            { ...dto },
            {new: true, projection: { 'passwordHash': false }}
            ).exec()
    }

    async findProfile(userId: string) {
        return this.userModel
            .findOne(
                { _id: userId },
                {'passwordHash': false }
            )
            .populate({path: 'profile', model: this.profileModel})
            .exec()
    }
}
