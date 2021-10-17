import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserModel } from '../users/user.model';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    ) { }

    async updateProfile({userId, ...dto}: UpdateProfileDto) {
        return this.userModel
            .findOneAndUpdate(
            {userId},
            { ...dto },
            {new: true, projection: { 'passwordHash': false }}
            ).exec()
    }

    async findProfile(profileId: string) {
        return this.userModel
            .findOne(
                { profileId },
                {'passwordHash': false }
            )
            .exec()
    }
}