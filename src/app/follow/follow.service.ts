import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { UserEntity } from '../users/user.entity';
import { FollowRepository } from './follow.repository';
import { SubscribersRepository } from './subscribers.repository';
import { FollowResponseDto } from './dto/follow/follow.response.dto';
import { UnfollowResponseDto } from './dto/unfollow/unfollow.response.dto';

@Injectable()
export class FollowService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly followRepository: FollowRepository,
        private readonly subscribersRepository: SubscribersRepository,
    ) {
    }

    async findUser(followUser: string, options?: FindOneOptions<UserEntity>) {
        return this.userRepository.findOne({ id: followUser }, options);
    }

    async follow(subscriberId: string, ownerId: string): Promise<FollowResponseDto> {
        const subscriberOwner = (await this.findUser(ownerId, { relations: ['follow'] }))?.follow;
        const subscriber = (await this.findUser(subscriberId, { relations: ['follow'] }))?.follow;
        if (!subscriberOwner || !subscriber) {
            throw new BadRequestException('Данного пользователя не существует');
        }
        if (ownerId === subscriberId) {
            throw new BadRequestException('Пользователь не может подписаться сам на себя');
        }
        const userIsFollow = await this.followRepository.userIsFollow(subscriber.id, subscriberOwner.id);
        if (userIsFollow) {
            throw new BadRequestException('Пользователь уже подписан');
        }
        const follow1 = await this.followRepository.findOne(subscriber.id);
        const follow2 = await this.followRepository.findOne(subscriberOwner.id);
        const newFollow = await this.subscribersRepository.saveAndGet({
            subscriber: follow1,
            subscriberOwner: follow2,
        });
        if (!newFollow) {
            throw new BadRequestException('Не удалось подписаться');
        }
        return newFollow;
    }

    async unfollow(subscriberId: string, ownerId: string): Promise<UnfollowResponseDto> {
        const subscriberOwner = (await this.findUser(ownerId, { relations: ['follow'] }))?.follow;
        const subscriber = (await this.findUser(subscriberId, { relations: ['follow'] }))?.follow;
        if (!subscriberOwner || !subscriber) {
            throw new BadRequestException('Данного пользователя не существует');
        }
        if (ownerId === subscriberId) {
            throw new BadRequestException('Пользователь не может отписаться от себя');
        }
        const userFollow = await this.followRepository.userFollow(subscriber.id, subscriberOwner.id);
        if (!userFollow?.id) {
            throw new BadRequestException('Пользователь не подписан');
        }
        const deleteSubscriber = await this.subscribersRepository.delete({ id: userFollow.id });
        return {
            deleted: deleteSubscriber.affected === 1,
        }; // TODO
    }
}
