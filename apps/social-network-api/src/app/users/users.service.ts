import { BadRequestException, Injectable } from '@nestjs/common';
import { FollowUsersModel, UserEntity, UsersRepository } from '@app/nest-postgre';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {
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
