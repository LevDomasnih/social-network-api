import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from '../users/user.model';
import { FollowDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
    ) { }

    async findUser(followUser: string) {
        return this.userModel.findOne({ followUser }).exec();
    }

    async follow(dto: FollowDto) {
        const followUser = this.findUser(dto.followUserId);

        if (dto.followUserId === dto.userId) {
            throw new BadRequestException('Пользователь не может подписаться сам на себя');
        }

        if (!followUser) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        const userIsFollow = await this.userModel
            .findOne(
                { _id: dto.userId, follow: { $in: [dto.followUserId] } }
            )
            .exec();

        if (userIsFollow) {
            throw new BadRequestException('Пользователь уже подписан');
        }

        return this.userModel
            .findOneAndUpdate(
                { _id: dto.userId },
                { $push: { follow: dto.followUserId } },
                { new: true, projection: { 'passwordHash': false } }
            ).exec();
    }

    async unfollow(dto: FollowDto) {
        const followUser = this.findUser(dto.followUserId);

        if (dto.followUserId === dto.userId) {
            throw new BadRequestException('Пользователь не может подписаться сам на себя');
        }

        if (!followUser) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        const userIsFollow = await this.userModel
            .findOne({ userId: dto.userId, follow: { $in: [dto.followUserId] } })
            .exec();

        if (!userIsFollow) {
            throw new BadRequestException('Пользователь не подписан');
        }

        return this.userModel
            .findOneAndUpdate(
                { _id: dto.userId },
                { $pull: { follow: dto.followUserId } },
                { new: true, projection: { 'passwordHash': false } }
            ).exec();
    }
}
