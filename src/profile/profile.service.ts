import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { UserModel } from '../users/user.model';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(ProfileModel) private readonly profileModel: ModelType<ProfileModel>,
    ) { }

    async updateProfile(user: UserModel, dto: UpdateProfileRequestDto ) {
        const profile = await this.profileModel
            .findOneAndUpdate(
                { owner: user._id },
                { ...dto },
                { new: true}
            ).exec()

        if (!profile) {
            throw new BadRequestException('Профиль отсутствует')
        }

        return profile
    }

    async findProfile(userId: string) {
        const profile = await this.profileModel.findById(userId)

        if (!profile) {
            throw new BadRequestException('Профиль отсутствует')
        }

        return profile
    }
}
