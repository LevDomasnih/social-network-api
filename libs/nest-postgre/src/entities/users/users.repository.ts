import { EntityRepository } from 'typeorm';
import { UserEntity } from './user.entity';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { BaseRepository, FollowUsersModel, UserRepositoryInterface } from '@app/nest-postgre/entities';
import { GetSqlResponse, SqlToJsonModel } from '@app/common';
import {
    GetUsersWithProfileAndAvatarModel,
} from '@app/nest-postgre/entities/users/models/get-users-with-profile-and-avatar.model';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(UserEntity)
export class UsersRepository extends BaseRepository<UserEntity> implements UserRepositoryInterface {
    async existsByOptions(options: FindConditions<UserEntity>): Promise<boolean> {
        const search = await this.findOne(options);
        return search !== undefined;
    }

    async getUserById(id: string) {
        const user = await this.findOne(id);
        if (!user) {
            throw new BadRequestException('Пользователя не существует');
        }
        return user;
    }

    async getUserBaseInfoById(id: string) {
        const user = await this.findOne(id, {relations: ['profile', 'profile.avatar']});
        if (!user) {
            throw new BadRequestException('Пользователя не существует');
        }
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            firstName: user.profile?.firstName,
            lastName: user.profile?.lastName,
            middleName: user.profile?.middleName,
            avatar: user.profile?.avatar,
        };
    }

    async getUserDialogsById(id: string) {
        const user = await this.findOne(id, {relations: ['dialogs', 'dialogs.owners']});
        return user?.dialogs || [];
    }

    async getUsers() {
        return this.find();
    }

    async existsById(id: string | number): Promise<boolean> {
        const search = await this.findOne(id);
        return search !== undefined;
    }

    async getFollowUser(id: string | number): Promise<FollowUsersModel[] | []> {
        return this.db.query(`
            SELECT u.id, u.email, u.login
            FROM follow f
                     INNER JOIN subscribers s ON f.id = s."subscriber_id"
                     INNER JOIN users u ON u.id = f."ownerId"
            WHERE f.id = $1
        `, [id]);
    }

    async getUsersWithProfileAndAvatar() {
        const response: SqlToJsonModel<GetUsersWithProfileAndAvatarModel>[] = await this.db.query(`
            SELECT coalesce(
                           (SELECT json_agg(
                                           json_build_object(
                                                   'id',
                                                   u.id,
                                                   'createdAt',
                                                   u.create_at,
                                                   'updatedAt',
                                                   u.update_at,
                                                   'email',
                                                   u.email,
                                                   'login',
                                                   u.login,
                                                   'profile',
                                                   json_build_object(
                                                           'firstName',
                                                           p2.first_name,
                                                           'lastName',
                                                           p2.last_name,
                                                           'middleName',
                                                           p2.middle_name,
                                                           'avatar',
                                                           'http://localhost:3000/PUBLIC/' || avatar.name
                                                       )
                                               )::jsonb
                                       ) as query
                            FROM users u
                                     LEFT JOIN profiles p2 on u.id = p2.owner_id
                                     LEFT JOIN files avatar on p2.avatar_id = avatar.id), '[]'::json -> 0
                       ) as rows

        `);
        return new GetSqlResponse<GetUsersWithProfileAndAvatarModel>().getRows(response);
    }
}
