import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '@app/nest-postgre';
import { GetUserByIdInterfaceReturn } from './interfaces/get-user-by-id.interface';
import { UsersServiceInterface } from './interfaces/users.service.interface';
import { GetUsersInterfaceReturn } from './interfaces/get-users.interface';
import { GetFollowInterfaceReturn } from './interfaces/get-follow.interface';

@Injectable()
export class UsersService implements UsersServiceInterface {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async getUserById(id: string): Promise<GetUserByIdInterfaceReturn> {
        const user = await this.usersRepository.findOne(id, {
            relations: ['profile', 'profile.avatar', 'profile.mainImage'],
        });
        if (!user) {
            throw new BadRequestException('Пользователя не существует');
        }
        return {
            ...user,
            profile: {
                ...user.profile,
                avatar: user.profile?.avatar?.getFilePath() || null,
                mainImage: user.profile?.mainImage?.getFilePath() || null,
            },
        };
    }

    async getUsers(): Promise<GetUsersInterfaceReturn[]> {
        return this.usersRepository.getUsersWithProfileAndAvatar();
    }

    async getFollowUsers(id: string): Promise<GetFollowInterfaceReturn[] | []> {
        return this.usersRepository.getFollowUser(id);
    }
}
