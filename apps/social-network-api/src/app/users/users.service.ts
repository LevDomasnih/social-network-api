import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@app/nest-postgre';
import { UsersServiceInterface } from './interfaces/users.service.interface';
import { GetFollowInterfaceReturn } from './interfaces/get-follow.interface';

@Injectable()
export class UsersService implements UsersServiceInterface {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async getFollowUsers(id: string): Promise<GetFollowInterfaceReturn[] | []> {
        return this.usersRepository.getFollowUser(id);
    }
}
