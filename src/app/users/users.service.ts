import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from '../follow/follow.entity';
import { Repository } from 'typeorm';
import { SubscribersEntity } from '../follow/subscribers.entity';
import { UserMeModel } from './models/user-me.model';
import { UserEntity } from './user.entity';
import { FollowUsersModel } from './models/follow-users.model';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
        @InjectRepository(SubscribersEntity) private readonly subscribersRepository: Repository<SubscribersEntity>,
    ) {
    }

    async getMe(id: string): Promise<UserMeModel> {
        return (await this.usersRepository.findOne(id, {
            relations: ['profile'],
        })) as unknown as Promise<UserMeModel>;
    }

    async getUserById(id: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOne(id);
        if (!user) {
            throw new BadRequestException('Пользователя не существует');
        }
        return user;
    }

    async getUsers(): Promise<UserEntity[]> {
        return this.usersRepository.find({});
    }

    async getFollowUsers(id: string): Promise<FollowUsersModel[] | []> {
        return this.usersRepository.getFollowUser(id);
    }
}
