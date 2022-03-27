import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from '../follow/follow.entity';
import { createQueryBuilder, getManager, Repository } from 'typeorm';
import { SubscribersEntity } from '../follow/subscribers.entity';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
        @InjectRepository(SubscribersEntity) private readonly subscribersRepository: Repository<SubscribersEntity>,
    ) {
    }

    async getMe(id: string) {
        return this.usersRepository.findOne(id, {
            relations: ['profile'],
        });
    }

    async getUserById(id: string) {
        const user = await this.usersRepository.findOne(id);

        if (!user) { throw new BadRequestException('Пользователя не существует') }

        return user;
    }

    async getUsers() {
        return this.usersRepository.find({});
    }

    async getFollowUsers(id: string) {
        // const entityManager = getManager();
        // const someQuery = await entityManager.query(`
        //     SELECT u.* FROM follow f
        //     INNER JOIN subscribers s ON f.id = s."subscriberId"
        //     INNER JOIN users u ON u.id = f."ownerId"
        //     WHERE f.id = '3cdcacc9-bedf-4314-98fe-d0eeaa0debde'
        // `)
        return createQueryBuilder()
            .select()
            .from(FollowEntity ,'follow')
            .where('follow.id = :id', { id })
            .innerJoinAndSelect('follow.subscriber', '')
            .innerJoinAndSelect('follow.owner', 'owner')
            .execute()
    }
}
