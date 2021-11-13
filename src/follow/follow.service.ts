import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from '../users/user.model';
import { FollowRequestDto } from './dto/follow-request.dto';
import { FollowModel } from './follow.model';
import { Types } from 'mongoose';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(FollowModel) private readonly followModel: ModelType<FollowModel>
    ) { }

    async findUser(followUser: string) {
        return this.userModel.findOne({ _id: followUser }).exec();
    }

    async follow(dto: FollowRequestDto) {
        const followUser = await this.findUser(dto.followUserId);
        const user = await this.findUser(dto.userId);

        if (!followUser || !user) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        if (dto.followUserId === dto.userId) {
            throw new BadRequestException('Пользователь не может подписаться сам на себя');
        }

        const followUserId = new Types.ObjectId(dto.followUserId)

        const userIsFollow = await this.followModel
            .findOne({
                _id: user.follow!._id,
                followUser: { $in: [followUserId] }
            })

        if (userIsFollow) {
            throw new BadRequestException('Пользователь уже подписан');
        }

        const newFollow = await this.followModel
            .findOneAndUpdate(
                { _id: user.follow!._id },
                { $push: {followUser: followUserId}},
                { new: true }
            ).exec()

        if (!newFollow) { throw new BadRequestException('Не удалось подписаться') }

        return newFollow
    }

    async unfollow(dto: FollowRequestDto) {
        const followUser = await this.findUser(dto.followUserId);
        const user = await this.findUser(dto.userId);

        if (!followUser || !user) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        if (dto.followUserId === dto.userId) {
            throw new BadRequestException('Пользователь не может отписаться от себя');
        }

        const followUserId = new Types.ObjectId(dto.followUserId)

        const userIsFollow = await this.followModel
            .findOne({
                _id: user.follow!._id,
                followUser: { $in: [followUserId] }
            })

        if (!userIsFollow) {
            throw new BadRequestException('Пользователь не подписан');
        }



        const newFollow = await this.followModel
            .findOneAndUpdate(
                { _id: user.follow!._id },
                { $pull: {followUser: followUserId} },
                { new: true }
            ).exec();

        if (!newFollow) { throw new BadRequestException('Не удалось отписаться') }

        return newFollow
    }
}
