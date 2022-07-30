import { BadRequestException, Injectable } from '@nestjs/common';
import { FollowUsersModel, UserEntity, UsersRepository } from '@app/nest-postgre';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async getUserById(id: string)/*: Promise<UserEntity> */{ // FIXME ADD profile and avatar in DTO
        const user = await this.usersRepository.findOne(id, {
            relations: ['profile', 'profile.avatar', 'profile.mainImage']
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
            }
        };
    }

    async getUsers(): Promise<{}> { // FIXME DTO
        return this.usersRepository.getUsersWithProfileAndAvatar();
    }

    async getFollowUsers(id: string): Promise<FollowUsersModel[] | []> {
        return this.usersRepository.getFollowUser(id);
    }
}
