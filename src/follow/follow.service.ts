import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from '../users/user.model';
import { FollowDto } from './dto/follow.dto';
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

    async follow(dto: FollowDto) {
        const followUser = this.findUser(dto.followUserId);
        const user = this.findUser(dto.userId);

        if (dto.followUserId === dto.userId) {
            throw new BadRequestException('Пользователь не может подписаться сам на себя');
        }

        if (!followUser || !user) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        const followId = await this.userModel
            .findOne(
                { _id: dto.userId, }
            )
            .select('follow -_id')
            .exec();

        const userIsFollow = await this.followModel
            .findOne({
                _id: followId?.follow?._id,
                followUser: { $in: [new Types.ObjectId(dto.followUserId)] }
            })

        if (userIsFollow) {
            throw new BadRequestException('Пользователь уже подписан');
        }

        return this.followModel
            .findOneAndUpdate(
                {_id: followId?.follow?._id},
                { $push: {followUser: new Types.ObjectId(dto.followUserId)}},
                {new: true}
            ).exec()
    }

    // async unfollow(dto: FollowDto) {
    //     const followUser = this.findUser(dto.followUserId);
    //
    //     if (dto.followUserId === dto.userId) {
    //         throw new BadRequestException('Пользователь не может подписаться сам на себя');
    //     }
    //
    //     if (!followUser) {
    //         throw new BadRequestException('Данного пользователя не существует');
    //     }
    //
    //     const userIsFollow = await this.userModel
    //         .findOne({ userId: dto.userId, follow: { $in: [dto.followUserId] } })
    //         .exec();
    //
    //     if (!userIsFollow) {
    //         throw new BadRequestException('Пользователь не подписан');
    //     }
    //
    //     return this.userModel
    //         .findOneAndUpdate(
    //             { _id: dto.userId },
    //             { $pull: { follow: dto.followUserId } },
    //             { new: true, projection: { 'passwordHash': false } }
    //         ).exec();
    // }
}
