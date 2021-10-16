import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProfileModel } from './profile.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(ProfileModel) private readonly profileModel: ModelType<ProfileModel>
    ) { }

    async createProfile(profileId: string, name: string) {
        return this.profileModel.create({
            profileId,
            name,
            status: '',
            about: ''
        })
    }

    async updateProfile({profileId, name, status, about}: UpdateProfileDto) {
        return this.profileModel.findOneAndUpdate({profileId}, {name, status, about}, {new: true}).exec()
    }

    async findProfile(profileId: string) {
        return this.profileModel.findOne({ profileId }).exec()
    }
}
