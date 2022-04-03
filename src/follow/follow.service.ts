import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from '../users/user.model';
import { FollowRequestDto } from './dto/follow-request.dto';
import { FollowModel } from './follow.model';
import { Types } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from './follow.entity';
import { createQueryBuilder, In, Repository } from 'typeorm';
import { UsersRepository } from '../users/users.repository';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { UserEntity } from '../users/user.entity';
import { SubscribersEntity } from './subscribers.entity';

@Injectable()
export class FollowService {
    constructor(
        private readonly userRepository: UsersRepository,
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(FollowModel) private readonly followModel: ModelType<FollowModel>,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
        @InjectRepository(SubscribersEntity) private readonly subscribersRepository: Repository<SubscribersEntity>,
    ) { }

    async findUser(followUser: string, options?: FindOneOptions<UserEntity>) {
        return this.userRepository.findOne({ id: followUser }, options);
    }

    async follow(subscriberId: string, ownerId: string) {
        const subscriberOwner = (await this.findUser(ownerId, { relations: ['follow'] }))?.follow;
        const subscriber = (await this.findUser(subscriberId, { relations: ['follow'] }))?.follow;

        if (!subscriberOwner || !subscriber) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        if (ownerId === subscriberId) {
            throw new BadRequestException('Пользователь не может подписаться сам на себя');
        }

        const userIsFollow = await createQueryBuilder()
            .select()
            .from(FollowEntity, 'follow')
            .where('follow.id = :followId', { followId: subscriber.id })
            .innerJoinAndSelect('follow.subscriber', 's')
            .andWhere('s.subscriberOwnerId = :ownerId', {ownerId: subscriberOwner.id})
            .execute();

        if (!!userIsFollow.length) {
            throw new BadRequestException('Пользователь уже подписан');
        }

        const follow1 = await this.followRepository.findOne(subscriber.id)
        const follow2 = await this.followRepository.findOne(subscriberOwner.id)

        const newFollow = await this.subscribersRepository.save({
            subscriber: follow1,
            subscriberOwner: follow2
        })

        if (!newFollow) { throw new BadRequestException('Не удалось подписаться') }

        return newFollow
    }

    async unfollow(subscriberId: string, ownerId: string) {
        // const followUser = await this.findUser(dto.followUserId);
        // const user = await this.findUser(dto.userId);
        //
        // if (!followUser || !user) {
        //     throw new BadRequestException('Данного пользователя не существует');
        // }
        //
        // if (dto.followUserId === dto.userId) {
        //     throw new BadRequestException('Пользователь не может отписаться от себя');
        // }
        //
        // const followUserId = new Types.ObjectId(dto.followUserId)

        // const userIsFollow = await this.followModel
        //     .findOne({
        //         _id: user.follow!._id,
        //         followUser: { $in: [followUserId] }
        //     })
        //
        // if (!userIsFollow) {
        //     throw new BadRequestException('Пользователь не подписан');
        // }
        //
        //
        //
        // const newFollow = await this.followModel
        //     .findOneAndUpdate(
        //         { _id: user.follow!._id },
        //         { $pull: {followUser: followUserId} },
        //         { new: true }
        //     ).exec();
        //
        // if (!newFollow) { throw new BadRequestException('Не удалось отписаться') }
        //
        // return newFollow
    }
}
