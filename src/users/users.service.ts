import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';
import { FollowModel } from '../follow/follow.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(FollowModel) private readonly followModel: ModelType<FollowModel>,
    ) {
    }

    async getUserById(id: string) {
        const user = await this.userModel.findOne({ _id: id }, { 'passwordHash': false })

        if (!user) { throw new BadRequestException('Пользователя не существует') }

        return user
    }

    async getUsers() {
        return this.userModel.find({}, { 'passwordHash': false }).exec();
    }

    async getFollowUsers(id: string) {
        return this.followModel.findOne({ userId: id })
            .populate({ path: 'followUser', model: UserModel })
            .select('followUser')
            .exec()
            .then(f => f!.followUser);
    }
}
