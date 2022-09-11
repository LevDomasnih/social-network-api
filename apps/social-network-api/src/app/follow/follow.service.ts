import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FollowRepository, SubscribersRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { FollowServiceInterface } from './interfaces/follow.service.interface';
import { FollowInterface } from './interfaces/follow.interface';
import { UnfollowInterface } from './interfaces/unfollow.interface';

@Injectable()
export class FollowService implements FollowServiceInterface {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly followRepository: FollowRepository,
        private readonly subscribersRepository: SubscribersRepository,
    ) {
    }

    private async findUser(followUser: string, options?: FindOneOptions<UserEntity>) {
        return this.userRepository.findOne({ id: followUser }, options);
    }

    async follow(subscriberId: string, ownerId: string): Promise<FollowInterface> {
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

    async unfollow(subscriberId: string, ownerId: string): Promise<UnfollowInterface> {
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
